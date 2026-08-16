// Repo presentation linter — generalises scripts/geo-gate.mjs (portfolio repo)
// from one site's dist/ to every public repo on the account.
//
// Per repo it checks the presentation layer against CANON:
//   1. GitHub description present and non-empty            (hard)
//   2. Topics >= CANON.minTopics                           (hard)
//   3. Website field set                                   (hard)
//   4. README byline + canon claim numbers where relevant  (hard/warn per CANON.claims)
//   5. Banned strings absent from README + description     (hard — DO-NOT-SHIP)
//   6. README links to canonical site (hard) and DOI (warn while DOI is pending)
//   7. Pinned-repo order — not readable unauthenticated; reported as manual check
//
// Evidence discipline (campaign OS rule 8d): a field is only "missing" if the
// request that would show it succeeded (HTTP 200, or a definitive 404 for a raw
// README). Any other status — rate limit, proxy block, network error — makes the
// dependent checks "unverified", never "fail". READMEs are fetched from
// raw.githubusercontent.com with a cache-busting query param.
//
// Run:  node repo-lint.mjs [--json]
// Exit: non-zero iff any hard check fails. "unverified" does not fail the gate
//       but is printed loudly — rerun where the API is reachable before trusting
//       a clean bill.

const CANON = {
    owner: 'zoeb-nomi',
  
    // Byline that must appear verbatim in every README.
    byline: 'Zoeb Nomi',
  
    // DO-NOT-SHIP strings (copy-pack.md rule 5). Regexes, checked against
    // README and description. "1,200+" and variants like "1200+".
    banned: [
      { label: '1,200+ / 1200+ (benchmark-runs claim, not in canon)', re: /1,?200\+/ },
        ],
  
    // Cross-links required in every README.
    links: {
          site: { label: 'zoebnomi.com', re: /zoebnomi\.com/i, level: 'fail' },
          doi: {
                  label: 'Zenodo DOI',
                  re: /doi\.org\/|zenodo\.org\//i,
                  level: 'warn',
                  pendingNote: 'DOI link missing (pending — DOI being minted this week)',
          },
    },
  
    // Canon claim numbers. Each claim: strings that must ALL appear (substring
    // match), the repos where absence is a hard fail, and the repos where
    // absence is a warning. Repos in neither list are not checked for it.
    claims: [
      {
              id: 'citation precision 0.981 -> 0.994',
              strings: ['0.981', '0.994'],
              requiredIn: ['crosssource', 'zoeb-nomi'],
              recommendedIn: ['portfolio'],
      },
      {
              id: '~95% golden-set citation accuracy',
              strings: ['~95%'],
              requiredIn: [],
              recommendedIn: ['zoeb-nomi', 'portfolio'],
      },
      {
              id: '270K-record corpus',
              strings: ['270K'],
              requiredIn: [],
              recommendedIn: ['zoeb-nomi', 'portfolio'],
      },
        ],
  
    minTopics: 5,
  
    // Used only when the unauthenticated list-repos API is unreachable
    // (enumeration is then reported as unverified against this list).
    fallbackRepos: ['crosssource', 'mirror-eval', 'portfolio', 'zoeb-nomi'],
};

// ---------------------------------------------------------------------------

const asJson = process.argv.includes('--json');
const bust = () => `cb=${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

async function get(url, headers = {}) {
    try {
          const res = await fetch(url, {
                  headers: { 'user-agent': 'repo-lint (zoeb-nomi presentation gate)', ...headers },
                  redirect: 'follow',
          });
          return { ok: res.ok, status: res.status, text: await res.text() };
    } catch (e) {
          return { ok: false, status: 0, text: '', error: String(e && e.message || e) };
    }
}

async function getRepoMeta(name) {
    const r = await get(`https://api.github.com/repos/${CANON.owner}/${name}?${bust()}`, {
          accept: 'application/vnd.github+json',
    });
    if (r.status !== 200) return { verified: false, status: r.status, error: r.error };
    try {
          return { verified: true, status: 200, data: JSON.parse(r.text) };
    } catch {
          return { verified: false, status: r.status, error: 'unparseable JSON' };
    }
}

async function getReadme(name) {
    // HEAD resolves the default branch without needing the API.
    for (const ref of ['HEAD', 'main', 'master']) {
          const r = await get(
                  `https://raw.githubusercontent.com/${CANON.owner}/${name}/${ref}/README.md?${bust()}`
                );
          if (r.status === 200) return { verified: true, exists: true, text: r.text };
          if (r.status === 404) continue; // definitive miss on this ref; try next
          return { verified: false, status: r.status, error: r.error }; // rate-limit / block / network
    }
    return { verified: true, exists: false, text: '' }; // 404 on every ref = genuinely absent
}

async function listRepos() {
    const r = await get(
          `https://api.github.com/users/${CANON.owner}/repos?per_page=100&${bust()}`,
      { accept: 'application/vnd.github+json' }
        );
    if (r.status === 200) {
          try {
                  return { verified: true, names: JSON.parse(r.text).map((x) => x.name) };
          } catch { /* fall through */ }
    }
    return { verified: false, status: r.status, names: CANON.fallbackRepos };
}

function lintRepo(name, meta, readme) {
    const checks = [];
    const push = (check, status, detail) => checks.push({ check, status, detail });
  
    // --- 1–3: API-backed metadata --------------------------------------------
    if (!meta.verified) {
          const why = `repos API returned ${meta.status}${meta.error ? ` (${meta.error})` : ''} — field state unknown, not reporting as missing`;
          push('description present', 'unverified', why);
          push(`topics >= ${CANON.minTopics}`, 'unverified', why);
          push('website field set', 'unverified', why);
    } else {
          const d = meta.data;
          push('description present', d.description && d.description.trim() ? 'pass' : 'fail',
                     d.description ? `"${d.description}"` : 'description is empty/null (API 200)');
          const topics = Array.isArray(d.topics) ? d.topics : [];
          push(`topics >= ${CANON.minTopics}`, topics.length >= CANON.minTopics ? 'pass' : 'fail',
                     `${topics.length} topics: [${topics.join(', ')}]`);
          push('website field set', d.homepage && d.homepage.trim() ? 'pass' : 'fail',
                     d.homepage ? d.homepage : 'homepage is empty/null (API 200)');
    }
  
    // --- 4–6: README-backed checks -------------------------------------------
    if (!readme.verified) {
          const why = `raw README fetch failed (${readme.status}${readme.error ? `: ${readme.error}` : ''}) — content unknown`;
          for (const c of ['README byline', 'banned strings (README)', 'link: site', 'link: DOI'])
                  push(c, 'unverified', why);
    } else if (!readme.exists) {
          push('README exists', 'fail', 'no README.md on HEAD/main/master (404 — definitive)');
    } else {
          const text = readme.text;
      
          push('README byline', text.includes(CANON.byline) ? 'pass' : 'fail',
                     `"${CANON.byline}" ${text.includes(CANON.byline) ? 'found' : 'NOT found in README'}`);
      
          for (const claim of CANON.claims) {
                  const level = claim.requiredIn.includes(name) ? 'fail'
                            : claim.recommendedIn.includes(name) ? 'warn' : null;
                  if (!level) continue;
                  const missing = claim.strings.filter((s) => !text.includes(s));
                  push(`canon claim: ${claim.id}`, missing.length === 0 ? 'pass' : level,
                               missing.length === 0 ? `all of [${claim.strings.join(', ')}] present`
                                 : `missing: [${missing.join(', ')}]`);
          }
      
          for (const b of CANON.banned) {
                  const hit = b.re.exec(text);
                  push(`banned string absent (README): ${b.label}`, hit ? 'fail' : 'pass',
                               hit ? `FOUND "${hit[0]}" — DO-NOT-SHIP` : 'absent');
          }
      
          push('link: site', CANON.links.site.re.test(text) ? 'pass' : 'fail',
                     CANON.links.site.re.test(text) ? 'README links zoebnomi.com' : 'no zoebnomi.com link in README');
          push('link: DOI', CANON.links.doi.re.test(text) ? 'pass' : 'warn',
                     CANON.links.doi.re.test(text) ? 'DOI link present' : CANON.links.doi.pendingNote);
    }
  
    // Banned strings in the description ride on API verification.
    if (meta.verified) {
          const desc = meta.data.description || '';
          for (const b of CANON.banned) {
                  const hit = b.re.exec(desc);
                  push(`banned string absent (description): ${b.label}`, hit ? 'fail' : 'pass',
                               hit ? `FOUND "${hit[0]}" in description — DO-NOT-SHIP` : 'absent');
          }
    } else {
          push('banned strings (description)', 'unverified', 'description unreadable (API not 200)');
    }
  
    // --- 7: pinned order ------------------------------------------------------
    push('pinned-repo order', 'unverified',
             'manual check — pinned order is not exposed by the unauthenticated REST API (GraphQL pinnedItems needs auth)');
  
    return checks;
}

async function main() {
    const listing = await listRepos();
    const report = { owner: CANON.owner, generated: new Date().toISOString(), enumeration: {}, repos: {} };
    report.enumeration = listing.verified
          ? { status: 'verified', detail: `users/${CANON.owner}/repos returned 200; ${listing.names.length} public repos` }
          : { status: 'unverified', detail: `list-repos API returned ${listing.status}; falling back to configured list [${listing.names.join(', ')}] — there may be public repos this run cannot see` };
  
    let anyFail = false;
    for (const name of listing.names) {
          const [meta, readme] = await Promise.all([getRepoMeta(name), getReadme(name)]);
          const checks = lintRepo(name, meta, readme);
          report.repos[name] = checks;
          if (checks.some((c) => c.status === 'fail')) anyFail = true;
    }
  
    if (asJson) {
          console.log(JSON.stringify(report, null, 2));
    } else {
          console.log(`\nREPO PRESENTATION GATE — ${CANON.owner} (${Object.keys(report.repos).length} repos)`);
          console.log('='.repeat(72));
          console.log(`[${report.enumeration.status.toUpperCase()}] enumeration — ${report.enumeration.detail}`);
          for (const [name, checks] of Object.entries(report.repos)) {
                  console.log(`\n${CANON.owner}/${name}`);
                  console.log('-'.repeat(72));
                  for (const c of checks) {
                            console.log(`[${c.status.toUpperCase().padEnd(10)}] ${c.check} — ${c.detail}`);
                  }
          }
          const totals = { pass: 0, fail: 0, warn: 0, unverified: 0 };
          for (const checks of Object.values(report.repos))
                  for (const c of checks) totals[c.status] = (totals[c.status] || 0) + 1;
          console.log('\n' + '='.repeat(72));
          console.log(`pass ${totals.pass} · fail ${totals.fail} · warn ${totals.warn} · unverified ${totals.unverified}`);
          console.log('='.repeat(72));
          console.log(anyFail ? '\nREPO GATE: FAIL' : '\nREPO GATE: PASS (warnings/unverified above, if any, still need eyes)');
    }
  
    if (anyFail) process.exit(1);
}

main();
onst x = { a: [1, 'foo'], re: /1,?200\+/, b: `template ${x}` };
