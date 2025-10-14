import axios from 'axios';

import {apiUrl} from 'src/constants/apiUrl';
import { useAdminStore } from 'src/store/useAdminStore';
import { AdminStorage } from 'src/storages/admins_storage';

export default class ConsumApi {
  static api = axios.create({headers: {"Access-Control-Allow-Origin": "*"}});

  // eslint-disable-next-line class-methods-use-this
  static async createCompetition({base64Cover, base64LastMiss, name_file_cover, name_file_last_miss, title, describe}, router) {
    try {
      const token = AdminStorage.getTokenAdmin();
      const body = {base64Cover: base64Cover.split(',')[1],base64LastMiss: base64LastMiss.split(',')[1], name_file_cover,name_file_last_miss, title, describe, };
      const response = await this.api.post(apiUrl.createCompetition, body, {headers: {'Authorization': token}});
      if (response.status >= 200 && response.status < 400) {
        const { data , success, message = ''} = response.data;
          if(success) {
            AdminStorage.saveCompetition(data);
            return { data , success}
          }
          if(!success && message.indexOf('token') !== -1) {
            // AdminStorage.clearStokage();
            // router.reload();
            return { error: Error(message) , success};
          }
          return { message , success};
      }
      return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  static async setNominate({nominate, event_id}) {
    try {
      const token = AdminStorage.getTokenAdmin();
      const body = {candidates: nominate, event_id, };
      const response = await this.api.post(apiUrl.setNominate, body, {headers: {'Authorization': token}});
      if (response.status >= 200 && response.status < 400) {
        const { data , success, message = ''} = response.data;
          if(success) {
            AdminStorage.validateNominate();
            return { data , success}
          }
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
      }
      return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  static async createEvent({base64, name_file, admin_id ,beginDate, endDate, price, devise, location, typeTicket, level, title}) {
    try {
      const token = AdminStorage.getTokenAdmin();
      const { id } = AdminStorage.getInfoCompetition();
      const body = {base64: base64.split(',')[1], name_file, beginDate, competition_id: id, endDate, price, devise, location, typeTicket,admin_id, level, title: title.trim()};
      const response = await this.api.post(apiUrl.createEvent, body, {headers: {'Authorization': token}});
      if (response.status >= 200 && response.status < 400) {
        const { data , success, message = ''} = response.data;
          if(success) {
            AdminStorage.saveInfoEdition(data);
            return { data , success}
          }
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
      }
      return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  static async getDetailsFormation({formationId}) {
    try {
      
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.get(`${apiUrl.training}/${formationId}`, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { result:data , etat:success, message} = response.data;
          if(success) return { data , success}
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
        }
        return {etat: false, message: "Un problème avec le serveur. Veuillez réssayer ultérieurement"}
    } catch (error) {
      return {etat: false, message: "Un problème lors de l'envoie. Veuillez vérifier votre connexion internet"}
    }
  }

  static async deleteFormation({_id}) {
    try {
      
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.delete(`${apiUrl.training}/${_id}`, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { result:data , etat:success, message} = response.data;
          if(success) return { data , success}
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
        }
        return {etat: false, message: "Un problème avec le serveur. Veuillez réssayer ultérieurement"}
    } catch (error) {
      return {etat: false, message: "Un problème lors de l'envoie. Veuillez vérifier votre connexion internet"}
    }
  }

  static async getAllTraining() {
    try {
      
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.get(apiUrl.training, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { result:data , etat:success, message = ''} = response.data;
          if(success) return { data , success}
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
        }
        return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  static async getAllJobOffer() {
    try {
      
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.get(apiUrl.jobOffer, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { result:data , etat:success, message = ''} = response.data;
          if(success) return { data , success}
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
        }
        return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  static async getPartners() {
    try {
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.get(apiUrl.partners, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { result:data , etat, message = ''} = response.data;
          if (etat) return data;
          console.log("Message erreur dans getPartners", message)
          if(!etat && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            throw new Error('Session Expiré veuillez vous réconnecter');
          }
          throw new Error(message);
        }
      throw new Error("Un problème avec le serveur. Veuillez réssayer ultérieurement");
    } catch (error) {
      throw new Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet");
    }
  }

  static async getGames() {
    try {
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.get(apiUrl.games, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { result:data , etat, message = ''} = response.data;
          if (etat) return data;
          if(!etat && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            throw new Error('Session Expiré veuillez vous réconnecter');
          }
          throw new Error(message);
        }
      throw new Error("Un problème avec le serveur. Veuillez réssayer ultérieurement");
    } catch (error) {
      throw new Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet");
    }
  }

  static async getCategoriesGames() {
    try {
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.get(apiUrl.category, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { result:data , etat, message = ''} = response.data;
          if (etat) return data;
          if(!etat && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            throw new Error('Session Expiré veuillez vous réconnecter');
          }
          throw new Error(message);
        }
      throw new Error("Un problème avec le serveur. Veuillez réssayer ultérieurement");
    } catch (error) {
      throw new Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet");
    }
  }

  static async getCertifications() {
    try {
      
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.get(apiUrl.certificationsOnShore, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { result:data , etat:success, message = ''} = response.data;
          if(success) return { data , success}
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
        }
        return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  static async getDashboard() {
    try {
      
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.get(apiUrl.dashboard, {headers: {'Authorization': token}});
        const { result:data , etat:success, message} = response.data;
        if (response.status >= 200 && response.status < 400) {
          
          if(success) return { data , success}
          // if(!success && message.indexOf('Unauthorized') !== -1) {
          //   // AdminStorage.clearStokage();
          //   return { message: "Session Expiré veuillez vous réconnecter" , success};
          // } 
          return { message , success};
        }
        return {success: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      const { etat:success, message} = error.response.data;

      if(!success && message.indexOf('Unauthorized') !== -1) {
        // AdminStorage.clearStokage();
        return { message: "Session Expiré veuillez vous réconnecter" , success:false};
      } 
      return {success: false, message:"Un problème lors de l'envoie. Veuillez vérifier votre connexion internet"}
    }
  }

  static async createFormation({cover, title, instructor, coverName, description, location, startDate, endDate}) {
    try {
      const token = AdminStorage.getTokenAdmin();
      const body = {cover: cover.split(',')[1], coverName, title, instructor, description, location, startDate, endDate};
        const response = await this.api.post(apiUrl.training, body, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { result:data , etat:success, message = ''} = response.data;
          if(success) {
            updateClientInfo(data);
            return { data , success}
          }
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
        }
        return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      console.log(error.response.data, 'error.response.data')
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  static async createPartners({ fullName, logo, number, email, password, role }) {
    const token = AdminStorage.getTokenAdmin();
    const body = { fullName, logo, number, email, password, role };

    try {
      const response = await this.api.post(apiUrl.partners, body, {
        headers: { 'Authorization': token }
      });

      if (response.status >= 200 && response.status < 400) {
        const { result: data, etat: success, message = '' } = response.data;

        if (success) {
          return data;
        }

        if (!success && message.toLowerCase().includes('token')) {
          AdminStorage.clearStokage();
          throw new Error("Session expirée, veuillez vous reconnecter.");
        }

        throw new Error(message || "La création du partenaire a échoué.");
      } else {
        throw new Error("Un problème avec le serveur. Veuillez réessayer ultérieurement.");
      }
    } catch (error) {
      console.error(error.response?.data || error.message, 'Erreur lors de la création du partenaire');
      throw new Error(
        error.response?.data?.message ||
        "Un problème lors de l'envoi. Veuillez vérifier votre connexion internet."
      );
    }
  }

  static async createGame({ nameProfil, base64Profil, title, description, videoCover, covers, isPortrait, url, categories }) {
    const token = AdminStorage.getTokenAdmin();
    const body = { nameProfil, base64Profil, title, description, videoCover, covers, isPortrait, url, categories };

    try {
      const response = await this.api.post(apiUrl.games, body, {
        headers: { 'Authorization': token }
      });

      if (response.status >= 200 && response.status < 400) {
        const { result: data, etat: success, message = '' } = response.data;

        if (success) {
          return data;
        }

        if (!success && message.toLowerCase().includes('token')) {
          AdminStorage.clearStokage();
          throw new Error("Session expirée, veuillez vous reconnecter.");
        }

        throw new Error(message || "La création du jeu a échoué.");
      } else {
        throw new Error("Problème de communication avec le serveur. Veuillez réessayer ultérieurement.");
      }
    } catch (error) {
      console.error(error.response?.data || error.message, 'Erreur lors de la création du jeu');
      throw new Error(
        error.response?.data?.message ||
        "Erreur lors de l'envoi des données. Vérifiez votre connexion internet."
      );
    }
  }
  
  static async createCategoryGames({ name, fileName, base64}) {
    const token = AdminStorage.getTokenAdmin();
    const body = { name, fileName, base64};

    try {
      const response = await this.api.post(apiUrl.category, body, {
        headers: { 'Authorization': token }
      });

      if (response.status >= 200 && response.status < 400) {
        const { result: data, etat: success, message = '' } = response.data;

        if (success) {
          return data;
        }

        if (!success && message.toLowerCase().includes('token')) {
          AdminStorage.clearStokage();
          throw new Error("Session expirée, veuillez vous reconnecter.");
        }

        throw new Error(message || "La création du jeu a échoué.");
      } else {
        throw new Error("Problème de communication avec le serveur. Veuillez réessayer ultérieurement.");
      }
    } catch (error) {
      console.error(error.response?.data || error.message, 'Erreur lors de la création du jeu');
      throw new Error(
        error.response?.data?.message ||
        "Erreur lors de l'envoi des données. Vérifiez votre connexion internet."
      );
    }
}


  static async createOrUpdateConfigPartners({ domaine, url_generate_otp, url_billing, isMobileMoney, admin_id}) {
    const token = AdminStorage.getTokenAdmin();
    const body = { domaine, url_generate_otp, url_billing, isMobileMoney, admin_id };
    if (url_generate_otp && url_generate_otp.length === 0) {
      delete body.url_generate_otp;
    }
    if (url_billing && url_billing.length === 0) {
      delete body.url_billing;
    }

    try {
      const response = await this.api.post(apiUrl.configPartner, body, {
        headers: { 'Authorization': token }
      });

      if (response.status >= 200 && response.status < 400) {
        const { result: data, etat: success, message = '' } = response.data;

        if (success) {
          return data;
        }

        if (!success && message.toLowerCase().includes('token')) {
          AdminStorage.clearStokage();
          throw new Error("Session expirée, veuillez vous reconnecter.");
        }

        throw new Error(message || "La création du partenaire a échoué.");
      } else {
        throw new Error("Un problème avec le serveur. Veuillez réessayer ultérieurement.");
      }
    } catch (error) {
      console.error(error.response?.data || error.message, 'Erreur lors de la création du partenaire');
      throw new Error(
        error.response?.data?.message ||
        "Un problème lors de l'envoi. Veuillez vérifier votre connexion internet."
      );
    }
  }


  
  

  static async login({email, password}) {
      try {
          const response = await this.api.post(apiUrl.authentication, {email, password});
          if (response.status >= 200 && response.status < 400) {
            const { result:data , etat:success, error} = response.data;
            if(success) {
              updateClientInfo(data);
              return { data , success};
            }
            return { error:  error[0], success};
          }
          return {success: false, error: response.data.error[0]}
          
      } catch (error) {
        const {message} = error.response.data
        return {success: false, error: message[0]}
      }
  }

  static async resetPassword({email}) {
      try {
          const response = await this.api.put(apiUrl.resetPassword, {email});
          if (response.status >= 200 && response.status < 400) {
            const { result:data , etat:success, error} = response.data;
            if(success) {
              return { data , success};
            }
            return { error:  error[0], success};
          }
          return {success: false, error: response.data.error[0]}
          
      } catch (error) {
        const {message} = error.response.data
        return {success: false, error: message[0]}
      }
  }

  static async validateJobOffre({_id, isActive}) {
    try {
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.put(apiUrl.jobOffer, {_id, isActive}, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { result:data , etat:success, error} = response.data;
          if(success) {
            updateClientInfo(data);
            return { data , success};
          }
          return { error:  error[0], success};
        }
        return {success: false, error: response.data.error[0]}
        
    } catch (error) {
      const {message} = error.response.data
      return {success: false, error: message[0]}
    }
}

  static async toogleEvent({event_id, display}) {
    try {
      const token = AdminStorage.getTokenAdmin();
      const response = await this.api.post(apiUrl.toogleDisplayEvent, {event_id, display, }, {headers: {'Authorization': token}});
      if (response.status >= 200 && response.status < 400) {
        const { data , success, message = ''} = response.data;
          if(success) {
            return { data , success}
          }
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
      }
      return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  static async setNumberNominate({event_id, ranking, candidate_id}) {
    try {
      const token = AdminStorage.getTokenAdmin();
      const response = await this.api.post(apiUrl.addNumberNominate, {event_id, ranking, candidate_id}, {headers: {'Authorization': token}});
      if (response.status >= 200 && response.status < 400) {
        const { data , success, message = ''} = response.data;
          if(success) {
            return { data , success}
          }
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
      }
      return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  // Gestion departements

  static async getAllDepartement() {
    try {
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.get(apiUrl.allDepartements, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { data , success, message = ''} = response.data;
          if(success) return { data , success}
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
        }
        return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  static async getAllRole() {
    try {
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.get(apiUrl.allRoles, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { data , success, message = ''} = response.data;
          if(success) return { data , success}
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
        }
        return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  static async createDepartement({nom_departement}) {
    try {
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.post(apiUrl.createDepartement, {nom_departement}, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { data , success, message = ''} = response.data;
          if(success) return { data , success}
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
        }
        return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  static async createDomaine({title}) {
    try {
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.post(apiUrl.domain, {title}, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { result:data , etat:success, message = ''} = response.data;
          if(success) return { data , success}
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
        }
        return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  static async deleteDomaine({_id}) {
    try {
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.delete(`${apiUrl.domain}/${_id}`, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { result:data , etat:success, message, error} = response.data;
          if(success) return { data , success}
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message: message ?? error[0] , success};
        }
        return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  static async deleteCertification({_id}) {
    try {
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.delete(`${apiUrl.certificationsOnShore}/${_id}`,{headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { result:data , etat:success, message = ''} = response.data;
          if(success) return { data , success}
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
        }
        return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  static async createCertification({title}) {
    try {
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.post(apiUrl.certificationsOnShore, {title}, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { result:data , etat:success, message = ''} = response.data;
          if(success) return { data , success}
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
        }
        return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  // Gestion Candidate

  static async getAllCandidateActive() {
    try {
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.get(apiUrl.allCandidateActive, {headers: {'Authorization': token}});
        if (response.status >= 200 && response.status < 400) {
          const { data , success, message = ''} = response.data;
          if(success) return { data , success}
          if(!success && message.indexOf('token') !== -1) {
            AdminStorage.clearStokage();
            return { message: "Session Expiré veuillez vous réconnecter" , success};
          } 
          return { message , success};
        }
        return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
    }
  }

  // Gestion Competitions
  static async getUsers() {
    try {
      const token = AdminStorage.getTokenAdmin();
        const response = await this.api.get(apiUrl.users, {headers: {'Authorization': token}});
        const { result:data , etat:success, message} = response.data;
        if (response.status >= 200 && response.status < 400) {
          
          if(success) return { data , success}
          return { message , success};
        }
        return {success: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
    } catch (error) {
      const { etat:success, message} = error.response.data;

      if(!success && message.indexOf('Unauthorized') !== -1) {
        // AdminStorage.clearStokage();
        return { message: "Session Expiré veuillez vous réconnecter" , success:false};
      } 
      return {success: false, message:"Un problème lors de l'envoie. Veuillez vérifier votre connexion internet"}
    }
  }

    // Gestion departements

    static async getAllAdmin(router) {
      try {
        const token = AdminStorage.getTokenAdmin();
          const response = await this.api.get(apiUrl.getAlladmin, {headers: {'Authorization': token}});
          if (response.status >= 200 && response.status < 400) {
            const { data , success, message = ''} = response.data;
            if(success) return { data , success}
            if(!success && message.indexOf('token') !== -1) {
              AdminStorage.clearStokage();
              router.reload();
              return { message: "Session Expiré veuillez vous réconnecter" , success};
            } 
            return { message , success};
          }
          return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
      } catch (error) {
        if(error.message === "Request failed with status code 401") {
          localStorage.clear();
          return {etat: false, error: Error("Session Expiré veuillez vous réconnecter")}
        }
        return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
      }
    }
  
    static async createAdmin({nom_complet, email, password, departement_id, role_id, gravatars, contact}) {
      try {
        const token = AdminStorage.getTokenAdmin();
        const body = {nom_complet, email, password, departement_id, role_id, gravatars, contact};
          const response = await this.api.post(apiUrl.addadmin, body, {headers: {'Authorization': token}});
          if (response.status >= 200 && response.status < 400) {
            const { data , success, message = ''} = response.data;
            if(success) return { data , success}
            if(!success && message.indexOf('token') !== -1) {
              AdminStorage.clearStokage();
              return { message: "Session Expiré veuillez vous réconnecter" , success};
            } 
            return { message , success};
          }
          return {etat: false, error: Error("Un problème avec le serveur. Veuillez réssayer ultérieurement")}
      } catch (error) {
        return {etat: false, error: Error("Un problème lors de l'envoie. Veuillez vérifier votre connexion internet")}
      }
  }

}

const updateClientInfo = (data) => {
  const { full_name: nom_complet, email: emailData, access_token, logo, role } = data.client;
  const adminData = { nom_complet, email: emailData, logo, role};
  useAdminStore.getState().setAdmin(adminData);
  AdminStorage.saveInfoAdmin(adminData);
  AdminStorage.saveTokenAdmin(access_token);
}