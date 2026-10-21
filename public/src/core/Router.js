// Hash router: #/product/3  ->  khớp '/product/:id'  ->  gọi handler({ id: '3' })
export default class Router {
  constructor() {
    this.routes = [];
    this.notFound = () => {};
    window.addEventListener('hashchange', () => this.resolve());
  }

  add(path, handler) {
    // '/product/:id' -> RegExp ^/product/([^/]+)$
    const keys = [];
    const pattern = path.replace(/:(\w+)/g, (_, key) => { keys.push(key); return '([^/]+)'; });
    this.routes.push({ regex: new RegExp(`^${pattern}$`), keys, handler });
    return this; // cho phép viết nối chuỗi router.add().add()
  }

  setNotFound(handler) { this.notFound = handler; return this; }

  resolve() {
    const path = location.hash.slice(1) || '/';
    for (const { regex, keys, handler } of this.routes) {
      const match = path.match(regex);
      if (match) {
        const params = Object.fromEntries(keys.map((k, i) => [k, decodeURIComponent(match[i + 1])]));
        return handler(params);
      }
    }
    this.notFound();
  }

  static navigate(path) { location.hash = path; }
}
