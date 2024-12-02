export type PackageItem = {
    name: string;
    version: string;
    checksum: string;
    asarFile: string;
    releaseDate: Date;
};

export type DownloadType = "latest" | "asar";
