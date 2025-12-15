// export class responseError extends Error {
//     constructor(public status: number, message: string) {
//         super(message);
//     }
// };

export class responseError extends Error {
    constructor(
        public status: number,
        public error: string,
        public message: string,
        public stackTrace?: string
    ) {
        super(message);
        this.stackTrace = stackTrace || new Error().stack;
    }
};
