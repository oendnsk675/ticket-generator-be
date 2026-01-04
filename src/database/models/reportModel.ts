export type exportFormat = "pdf" | "csv";
export type exportType = "scans" | "tickets";

export type exportReport = {
    format: exportFormat;
    type: exportType;
};

export type exportFile = {
    filename: string;
    contentType: string;
    buffer: Buffer;
};