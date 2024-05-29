const clientLocale = new Intl.Locale(navigator.language);
const clientLanguage = clientLocale.language;

const days = (date) => {
    return new Intl.DateTimeFormat(clientLanguage, {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
    }).format(new Date(date));
};

const times = (date) => {
    return new Intl.DateTimeFormat(clientLanguage, {
        hour: "numeric",
        minute: "numeric",
    }).format(new Date(date));
};

const timeAdjusment = (inputTime, inputTimeZone, targetTimeZone) => {
    let incomingDateTime = moment.tz(
        inputTime,
        "YYYY-MM-DD HH:mm:ss Z",
        inputTimeZone
    );
    const gmtDate = incomingDateTime.clone().tz(targetTimeZone);
    const formattedDate = gmtDate.format("YYYY-MM-DDTHH:mm:ss.SSS");
    return formattedDate;
};
