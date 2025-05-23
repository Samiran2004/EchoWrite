import ForgotPasswordMailTemplate from "./Template/forgotPassword.mail.template.js";
import SignUpMailtemplate from "./Template/signup.mail.template.js";
import SignUp2MailTemplate from "./Template/signup2.mail.js";

const MailTemplates = {
    SignUpMailtemplateContent: SignUpMailtemplate,
    SignUp2MailtemplateContent: SignUp2MailTemplate,
    ForgotPasswordMailContent: ForgotPasswordMailTemplate
}

export default MailTemplates;