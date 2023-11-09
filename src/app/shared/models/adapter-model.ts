import { ApiResponsePage } from "./response/api-response-page";

export class AdapterModel<Input, Output> {
    adapt!: (input: Input) => Output[];
    inArrayResponse !: (input:ApiResponsePage<Input>) => ApiResponsePage<Output>;
}
