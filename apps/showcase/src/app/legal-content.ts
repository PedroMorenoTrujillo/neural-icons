export type LegalPageType = "legal-notice" | "privacy" | "cookies";
type Lang = "es" | "en";

interface LegalSection {
  heading: string;
  paragraphs: string[];
}

interface LegalContent {
  title: string;
  updated: string;
  notice: string;
  sections: LegalSection[];
}

// Publication details have been supplied by the site owner; legal review remains advisable.
// Account contracts remain the owner's responsibility; describe verified technical settings.
export const LEGAL_CONTENT: Record<Lang, Record<LegalPageType, LegalContent>> = {
  es: {
    "legal-notice": {
      title: "Aviso legal",
      updated: "Actualizado: 11 de octubre de 2026",
      notice: "Información de titularidad y contacto del sitio.",
      sections: [
        { heading: "Titular del sitio", paragraphs: [
          "Responsable/titular: Pedro Moreno Trujillo, persona física. NIF/DNI: 31735784Q. Domicilio: Calle Azahar 26, Coín, 29100, Málaga, España. Correo de contacto: developmenttester.apps@gmail.com. No existe inscripción en Registro Mercantil o registro profesional aplicable.",
          "Este aviso se aplica a los sitio de Neural Icons en icons.neuralui.org. Las condiciones de la librería @neural-icons/core y de otros productos deben revisarse por separado.",
        ] },
        { heading: "Objeto y uso", paragraphs: [
          "El sitio presenta documentación y demostraciones de iconos. Los contenidos se ofrecen con fines informativos. El usuario debe utilizar el sitio de forma lícita y respetar los derechos de terceros.",
        ] },
        { heading: "Propiedad intelectual y enlaces", paragraphs: [
          "Los textos, diseños y materiales del showcase pertenecen a sus titulares respectivos y se rigen por sus licencias. Las marcas de terceros pertenecen a sus titulares. La publicación de documentación no concede derechos adicionales sobre esos materiales. La presencia de enlaces externos no implica control ni respaldo de sus contenidos.",
        ] },
        { heading: "Responsabilidad y ley aplicable", paragraphs: [
          "El titular procurará mantener la información actualizada y el servicio disponible, sin garantizar ausencia absoluta de errores o interrupciones. La normativa española y de la Unión Europea se aplicará en lo que corresponda, sin limitar los derechos imperativos de los consumidores.",
        ] },
      ],
    },
    privacy: {
      title: "Política de privacidad",
      updated: "Actualizado: 11 de octubre de 2026",
      notice: "Política común de los sitio de Neural Icons en icons.neuralui.org. Google Analytics solo se carga con tu consentimiento; rechazar no limita la documentación.",
      sections: [
        { heading: "Responsable y contacto", paragraphs: [
          "Responsable del tratamiento: Pedro Moreno Trujillo. Domicilio: Calle Azahar 26, Coín, 29100, Málaga, España. Email para privacidad y ejercicio de derechos: developmenttester.apps@gmail.com. No se ha designado delegado de protección de datos; puedes dirigirte directamente al responsable.",
        ] },
        { heading: "Datos, finalidades y bases jurídicas", paragraphs: [
          "El correo de contacto se gestiona mediante Gmail, un servicio de Google. Si escribes voluntariamente, utilizamos el mensaje y los datos que facilites para atender tu consulta, sobre la base del interés legítimo o de las medidas precontractuales que correspondan. Se conservan durante el tiempo necesario para atenderla y cumplir las obligaciones legales aplicables. No se vinculan con los valores de las demostraciones.",
          "El titular no adopta decisiones automatizadas con efectos jurídicos o de importancia similar sobre las personas visitantes. Puedes solicitar información sobre las garantías aplicables a las transferencias internacionales y, cuando corresponda, una copia de ellas al correo de privacidad.",
          "Para entregar el sitio y protegerlo frente a abusos, el proveedor de alojamiento puede tratar dirección IP, datos técnicos de la petición y registros de seguridad. Base jurídica: interés legítimo del titular en prestar y proteger el servicio, respetando los derechos de las personas visitantes; cuando exista obligación legal, cumplimiento de esa obligación.",
          "El tema elegido se guarda en el navegador para recordar preferencias del usuario. No se envía al titular para crear perfiles. Estas preferencias proporcionan la funcionalidad solicitada y no se utilizan para decisiones sobre personas.",
          "Google Analytics 4 (ID G-N1HFRNYZ0C) se carga solo tras aceptar analítica. Recoge identificadores de cookies, datos técnicos de navegador y dispositivo, y visitas a páginas para mejorar la documentación. Base jurídica: consentimiento. No enviamos parámetros de consulta ni fragmentos de las URL o del referente. No enviamos valores escritos en las demostraciones, ni activamos Google Signals o personalización publicitaria. La medición mejorada automática se desactiva para usar las visitas filtradas de la aplicación.",
          "El sitio no ofrece formulario de contacto. Si el usuario escribe voluntariamente a la dirección de contacto indicada, se tratarán los datos incluidos en su mensaje para atender la solicitud. Base jurídica: interés legítimo o medidas precontractuales, según el contenido, y cumplimiento de obligaciones legales cuando corresponda.",
        ] },
        { heading: "Conservación", paragraphs: [
          "La decisión de analítica se recuerda durante un máximo de 12 meses y se vuelve a solicitar si cambia esta política, sus finalidades o sus proveedores. Las preferencias locales permanecen hasta que el usuario las borre en el navegador. Las cookies de GA4 se configuran con un máximo de 12 meses desde su creación, sin renovación automática.",
          "La retención de datos de usuario y eventos de la propiedad GA4 está configurada en dos meses sin renovación. Los plazos de conservación de logs técnicos de Cloudflare se rigen por la configuración y documentación del proveedor. Los mensajes enviados voluntariamente por correo se conservan solo durante el tiempo necesario para atenderlos y cumplir obligaciones legales aplicables.",
        ] },
        { heading: "Destinatarios y transferencias internacionales", paragraphs: [
          "Cloudflare presta alojamiento y entrega del sitio. Google proporciona Analytics únicamente si el usuario consiente. Sus condiciones de tratamiento y subencargados regulan los servicios. Puede haber tratamiento fuera del Espacio Económico Europeo: se aplican las garantías del proveedor que correspondan, como cláusulas contractuales tipo y decisiones de adecuación para entidades adheridas al Marco de Privacidad de Datos UE-EE. UU. No se comparten las cookies ni la elección de analítica con los subdominios de UI o Admin Pro.",
          "La integración de medición de esta aplicación es Google Analytics 4. No incorpora SDK de publicidad ni otros servicios de seguimiento del comportamiento. Los enlaces a sitios externos tienen sus propias políticas.",
        ] },
        { heading: "Derechos y retirada", paragraphs: [
          "Puede solicitar acceso, rectificación, supresión, oposición, limitación y portabilidad, cuando procedan, escribiendo a developmenttester.apps@gmail.com. Puede retirar el consentimiento de analítica en cualquier momento mediante «Cambiar preferencias de privacidad»; la retirada no afecta al tratamiento previo lícito.",
          "También puede presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD), www.aepd.es. Las solicitudes de derechos se atienden conforme a los plazos del RGPD, generalmente un mes, con las ampliaciones justificadas previstas legalmente.",
        ] },
      ],
    },
    cookies: {
      title: "Política de cookies y almacenamiento local",
      updated: "Actualizado: 11 de octubre de 2026",
      notice: "Inventario de los sitio de Neural Icons. Las cookies de analítica solo se usan tras aceptar; la decisión solo se aplica a este sitio.",
      sections: [
        { heading: "Qué usamos y cómo decidir", paragraphs: [
          "El sitio usa almacenamiento local para guardar decisiones y preferencias. Google Analytics 4 solo se carga tras aceptar la categoría de analítica. Rechazar tiene el mismo acceso que aceptar. Ninguna preferencia local se usa para seguimiento entre sitios.",
          "Puede cambiar su decisión con el botón «Cambiar preferencias de privacidad» disponible permanentemente. Al retirar el consentimiento, el sitio elimina las cookies de analítica accesibles para este dominio y recarga la página para detener el código de Google. También puede borrar datos desde la configuración del navegador.",
        ] },
        { heading: "Duración y dominio", paragraphs: [
          "Los elementos de localStorage se guardan en icons.neuralui.org y no tienen caducidad automática del navegador, salvo la decisión de analítica, que el sitio invalida a los 12 meses. Las cookies _ga y _ga_<ID> distinguen visitas y sesiones y se configuran exclusivamente para icons.neuralui.org después de aceptar, con un máximo de 12 meses sin renovación automática. La decisión incluye fecha y versión de la política. No es necesario aceptar cookies de analítica para consultar el sitio.",
        ] },
        { heading: "Terceros", paragraphs: [
          "Google Analytics 4 es el proveedor de analítica opcional. Cloudflare aloja y entrega el sitio y puede tratar datos técnicos de las peticiones para seguridad. Las políticas y condiciones de ambos proveedores están enlazadas al final de esta página.",
        ] },
      ],
    },
  },
  en: {
    "legal-notice": {
      title: "Legal notice",
      updated: "Last updated: 11 October 2026",
      notice: "Site ownership and contact information.",
      sections: [
        { heading: "Website owner", paragraphs: [
          "Owner/controller: Pedro Moreno Trujillo, an individual. Tax ID: 31735784Q. Postal address: Calle Azahar 26, Coín, 29100, Málaga, Spain. Legal contact email: developmenttester.apps@gmail.com. This is a personal project.",
          "This notice covers the Neural Icons website at icons.neuralui.org. Terms for @neural-icons/core and other products require separate review.",
        ] },
        { heading: "Purpose and use", paragraphs: [
          "The site provides documentation and icon demonstrations. Content is informational. Visitors must use the site lawfully and respect third-party rights.",
        ] },
        { heading: "Intellectual property and links", paragraphs: [
          "The showcase text, designs, and materials belong to their respective owners and are governed by their licences. Third-party trademarks belong to their owners. Publishing documentation does not grant additional rights to these materials. External links do not imply control or endorsement.",
        ] },
        { heading: "Liability and applicable law", paragraphs: [
          "The owner aims to keep information current and the service available, without guaranteeing uninterrupted or error-free operation. Applicable Spanish and EU law governs without limiting mandatory consumer rights.",
        ] },
      ],
    },
    privacy: {
      title: "Privacy policy",
      updated: "Last updated: 11 October 2026",
      notice: "Policy for Neural Icons at icons.neuralui.org. Google Analytics loads only with your consent; rejecting does not restrict documentation.",
      sections: [
        { heading: "Controller and contact", paragraphs: [
          "Controller: Pedro Moreno Trujillo. Address: Calle Azahar 26, Coín, 29100, Málaga, Spain. Email for privacy requests and rights: developmenttester.apps@gmail.com. No data protection officer has been appointed; you can contact the controller directly.",
        ] },
        { heading: "Data, purposes, and legal bases", paragraphs: [
          "The contact mailbox uses Gmail, a Google service. If you voluntarily write to us, we use the message and information you provide to handle your enquiry, under the relevant legitimate interest or precontractual steps. We retain it for as long as necessary to address it and meet applicable legal obligations. It is not linked to values entered in demonstrations.",
          "The owner does not make automated decisions producing legal or similarly significant effects on visitors. Contact the privacy email for information about applicable international-transfer safeguards and, where appropriate, a copy of them.",
          "To deliver and protect the site, the hosting provider may process IP addresses, technical request data, and security logs. Legal basis: the owner's legitimate interest in providing and securing the service, while respecting visitors’ rights; legal obligation where applicable.",
          "The chosen theme is stored in the browser to remember user preferences. They are not sent to the owner to build profiles. These preferences provide the requested functionality and are not used to make decisions about individuals.",
          "Google Analytics 4 (ID G-N1HFRNYZ0C) loads only after analytics is accepted. It collects cookie identifiers, technical browser and device data, and page visits to improve documentation. Legal basis: consent. We omit URL and referrer query parameters and fragments. We do not send values entered in demonstrations or enable Google Signals or advertising personalization. Automatic enhanced measurement is disabled in favor of the application's filtered page views.",
          "The site has no contact form. If a visitor voluntarily emails the listed contact address, the message data is used to handle the request. Legal basis: legitimate interest or precontractual steps depending on the request, and legal obligation where applicable.",
        ] },
        { heading: "Retention", paragraphs: [
          "The analytics choice is valid for at most 12 months and is requested again if this policy, its purposes, or providers change. Local preferences remain until cleared in the browser. GA4 cookies are configured for a maximum of 12 months from creation, without automatic renewal.",
          "GA4 user and event data retention is set to two months without renewal. Retention of Cloudflare technical logs is governed by the provider's configuration and documentation. Messages voluntarily sent by email are retained only as long as necessary to address them and meet applicable legal obligations.",
        ] },
        { heading: "Recipients and international transfers", paragraphs: [
          "Cloudflare hosts and delivers the site. Google provides Analytics only with consent. Their processing terms and subprocessors govern these services. Processing may occur outside the European Economic Area, using the applicable provider safeguards such as standard contractual clauses and adequacy decisions for entities participating in the EU-US Data Privacy Framework. Neither analytics cookies nor the consent choice are shared with the UI or Admin Pro subdomains.",
          "Google Analytics 4 is this application's measurement integration. It does not incorporate advertising SDKs or other behavioral tracking services. External websites have their own policies.",
        ] },
        { heading: "Rights and withdrawal", paragraphs: [
          "Where applicable, you can request access, rectification, erasure, objection, restriction, and portability by writing to developmenttester.apps@gmail.com. You can withdraw analytics consent at any time through “Change privacy preferences”; withdrawal does not affect earlier lawful processing.",
          "You may complain to the Spanish Data Protection Agency (AEPD), www.aepd.es. Rights requests are handled within GDPR deadlines, generally one month, subject to the legally permitted and justified extensions.",
        ] },
      ],
    },
    cookies: {
      title: "Cookies and local storage policy",
      updated: "Last updated: 11 October 2026",
      notice: "Inventory for Neural Icons. Analytics cookies are used only after acceptance; the consent choice applies only to this website.",
      sections: [
        { heading: "What we use and how to choose", paragraphs: [
          "The site uses local storage for decisions and preferences. Google Analytics 4 loads only after the analytics category is accepted. Rejecting is as accessible as accepting. Local preferences are not used for cross-site tracking.",
          "You can change your choice through the permanent “Change privacy preferences” button. On withdrawal, the site removes analytics cookies accessible to this domain and reloads to stop Google's code. You can also clear browser data manually.",
        ] },
        { heading: "Duration and domain", paragraphs: [
          "localStorage items belong to icons.neuralui.org and have no automatic browser expiry, except the analytics choice, which the site invalidates after 12 months. The _ga and _ga_<ID> cookies distinguish visits and sessions and are configured exclusively for icons.neuralui.org after acceptance, for at most 12 months without automatic renewal. The consent record includes a date and policy version. Analytics cookies are not required to browse the site.",
        ] },
        { heading: "Third parties", paragraphs: [
          "Google Analytics 4 is the optional analytics provider. Cloudflare hosts and delivers the site and may process technical request data for security. Both providers' policies and terms are linked at the end of this page.",
        ] },
      ],
    },
  },
};

