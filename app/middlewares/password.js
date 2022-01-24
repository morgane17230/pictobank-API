const passwordMiddleware = () => {
  const l = 8;
  const c = "abcdefghijknopqrstuvwxyzACDEFGHJKLMNPQRSTUVWXYZ12345679";
  const n = c.length;

  const p = "!@#$+-*&_";
  const o = p.length;
  let r = "";

  const s = Math.floor(Math.random() * (p.length - 1));

  for (let i = 0; i < l; ++i) {
    if (s === i) {
      r += p.charAt(Math.floor(Math.random() * o));
    } else {
      r += c.charAt(Math.floor(Math.random() * n));
    }
  }
  return r;
};

module.exports = passwordMiddleware;
