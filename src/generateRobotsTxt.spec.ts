import { generateRobotsTxt } from './generateRobotsTxt';

describe(generateRobotsTxt, () => {
  it('returns a static string', () => {
    const string = generateRobotsTxt();
    expect(string).toEqual('Robotsx TXT');
  });
});
