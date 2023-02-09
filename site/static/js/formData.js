import { ready } from "./lib/ready.js";
class FormContent {
}
export class FormDataHandler {
    constructor() {
        this.impose = async () => {
            const form = document.querySelectorAll("form[data-format=json]");
            const self = this;
            form.forEach(function (node, index) {
                node.addEventListener("submit", async (event) => { await self.formSubmitted(event); });
            });
        };
        this.formSubmitted = async (event) => {
            event.preventDefault();
            const submitter = event.submitter;
            const action = submitter.name;
            grecaptcha.enterprise.ready(async () => {
                const token = await grecaptcha.enterprise.execute('6LeFa-QhAAAAAEIE4k21qrlwekprEQi0kURd43my', { action: action });
                const form = event.target;
                const formData = new FormData(form);
                let formContent = new FormContent();
                formContent.Fields = Object.fromEntries(formData);
                formContent.RecaptchaToken = token;
                formContent.Action = action;
                const json = JSON.stringify(formContent);
                console.log(json);
                document.getElementById("search_working").classList.remove("lib-hidden");
                const response = await fetch(event.target.getAttribute("action"), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: json
                });
                if (response.ok) {
                    const responseText = await response.text();
                    console.log(responseText);
                    document.getElementById("search_working").classList.add("lib-hidden");
                    document.getElementById("search_success").classList.remove("lib-hidden");
                }
            });
        };
    }
    static async setup() {
        let formData = new FormDataHandler();
        formData.impose();
    }
}
ready(FormDataHandler.setup);
//# sourceMappingURL=formData.js.map