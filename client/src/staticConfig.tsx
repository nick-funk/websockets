export class StaticConfig {
  private static _instance: StaticConfig

  public readonly port: number;
  public readonly wsPort: number;
  public readonly hostName: string;

  private constructor() {
    const element = document.getElementById("staticConfig");
    if (!element) {
      throw new Error("unable to find element for static config");
    }

    const raw = element.innerText.replace(/\"/g, "").replace(/&quot;/g, "\"");
    const data = JSON.parse(raw);

    this.port = data.port;
    this.wsPort = data.wsPort;
    this.hostName = data.hostName;
  }

  public static get(): StaticConfig {
    if (!StaticConfig._instance) {
      StaticConfig._instance = new StaticConfig();
    }

    return StaticConfig._instance;
  }

  public static get url(): string {
    const inst = StaticConfig.get();
    return `http://${inst.hostName}:${inst.port}`;
  }

  public static get wsUrl(): string {
    const inst = StaticConfig.get();
    return `ws://${inst.hostName}:${inst.wsPort}`;
  }

  public static api(path: string): string {
    return new URL(path, StaticConfig.url).toString();
  }
}