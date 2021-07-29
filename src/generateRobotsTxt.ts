type Policy = {
  userAgent?: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
};

export type RobotsTxtOptions = {
  policy?: Policy | Policy[];
  sitemap?: string | string[];
};

export function generateRobotsTxt(options: RobotsTxtOptions): string {
  const blocks: string[] = [];

  toArray(options.policy).forEach((policy) => {
    let policyBlock = '';
    toArray(policy.userAgent).forEach((ua) => (policyBlock += `user-agent: ${ua}\n`));
    toArray(policy.allow).forEach((a) => (policyBlock += `allow: ${a}\n`));
    toArray(policy.disallow).forEach((d) => (policyBlock += `disallow: ${d}\n`));
    blocks.push(policyBlock);
  });

  let sitemapBlock = '';
  toArray(options.sitemap).forEach((s) => (sitemapBlock += `sitemap: ${s}\n`));
  blocks.push(sitemapBlock);

  return blocks.filter(Boolean).join('\n').trim();
}

function toArray<T>(argument?: T | T[]): T[] {
  if (Array.isArray(argument)) {
    return argument;
  }
  return [argument as T].filter((element) => element !== undefined && element !== null);
}
