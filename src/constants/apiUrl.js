// Config DEV
const base_url = 'http://localhost:8080/api/v1/admin'; // 'https://comici.loca.lt/api/admin':'https://bcomissi.shouz.network/api/admin';
const base_url_asset = 'http://localhost:8080/uploads'; // 'https://comici.loca.lt/images':'https://bcomissi.shouz.network/images';
const base_url_frontend = 'http://localhost:3000';

// Config PROD
// const base_url = 'https://api.icmemployment.net/api/v1/admin';
// const base_url_asset = 'https://api.icmemployment.net/uploads';
// const base_url_frontend = 'https://www.icmemployment.net';

export const apiUrl =  {
    authentication: `${base_url}/signin`,
    // gestion admin
    addadmin: `${base_url}`,
    dashboard: `${base_url}/dashboard`,
    jobOffer: `${base_url}/jobOffer`,
    training: `${base_url}/training`,
    users: `${base_url}/users`,

    partners: `${base_url}/partners`,
    games: `${base_url}/games`,
    category: `${base_url}/category`,
    configPartner: `${base_url}/partners/config`,

    certificationsOnShore: `${base_url}/certification`,

    getAlladmin: `${base_url}`,
    updateAdminprofil: `${base_url}/updateprofil`,
    updateAdminpassword: `${base_url}/updatepassword`,
    generateAdminpassword: `${base_url}/generatepassword`,
    // gestion departement
    createDepartement: `${base_url}/postdepartement`,
    allDepartements: `${base_url}/alldepartement`,
    updateDepartement: `${base_url}/updatedepartement`,

    // gestion departement
    allRoles: `${base_url}/getrole`,

    // gestion competition
    createCompetition: `${base_url}/postcompetitions`,
    getCompetition: `${base_url}/getcompetition`,
    // gestion Event
    createEvent: `${base_url}/postevent`,
    detailFormation: `${base_url}/getdetailsevent`,
    addNumberNominate: `${base_url}/addnumbernominate`,
    toogleDisplayEvent: `${base_url}/changeetatevent`,

    // gestion candidate
    setNominate: `${base_url}/createnominate`,
    // gestion competition
    allCandidateActive: `${base_url}/getallcandidate`,

    // gestion actuality
    getAllactuality: `${base_url}/getactuality`,
    postactuality: `${base_url}/postactuality`,
}

export const apiUrlAsset =  {
    cv: `${base_url_asset}/resumes`,
    logo: `${base_url_asset}/logos`,
    coverFormation: `${base_url_asset}/formations`,
    candidate: `${base_url_asset}/candidates`,
    avatars: `${base_url_asset}/avatars`,
    games: `${base_url_asset}/games`,
    categories: `${base_url_asset}/categories`,
    competitions: `${base_url_asset}/competitions`,
    events: `${base_url_asset}/events`,
    actualites: `${base_url_asset}/actualites`,
}

export const apiUrlConsulteRessource =  {
    viewJob: (_id) => `${base_url_frontend}/job/${_id}?overview=admin`,
}