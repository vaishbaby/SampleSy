export class AppSettingsConfig {
    public static readonly BASE_URL: string;
    public static resources: { [key: string]: Resource };

    public static hasResource(url: string): boolean {
        return !!this.resources[url];
    }
}

export interface Resource {
    name: string;
    url: string;
}
