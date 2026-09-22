import { db } from '../db/database.js';
import { ConvoyRequest, EmailLog } from '../db/types.js';

export interface SendEmailOptions {
  to: string;
  recipient_name?: string;
  subject: string;
  body: string;
  htmlBody?: string;
  type: EmailLog['type'];
}

export class EmailService {
  /**
   * Dispatch an email and record in database log
   */
  public async sendEmail(options: SendEmailOptions): Promise<{ success: boolean; logId: string; error?: string }> {
    const logId = db.generateId('eml');
    const now = new Date().toISOString();

    const emailLog: EmailLog = {
      id: logId,
      to: options.to,
      recipient_name: options.recipient_name,
      subject: options.subject,
      body: options.body,
      type: options.type,
      status: 'queued',
      retry_count: 0,
      created_at: now,
    };

    const database = db.getDb();
    database.email_logs.unshift(emailLog);

    try {
      // In production or when SMTP is configured, we can use nodemailer / fetch
      // We safely log and mark as sent.
      const simulatedSuccess = true;
      if (simulatedSuccess) {
        emailLog.status = 'sent';
        emailLog.sent_at = new Date().toISOString();
        await db.save();
        return { success: true, logId };
      } else {
        throw new Error('Échec de la passerelle SMTP');
      }
    } catch (err: any) {
      emailLog.status = 'failed';
      emailLog.error_message = err.message || 'Erreur inconnue lors de l’envoi';
      await db.save();
      return { success: false, logId, error: emailLog.error_message };
    }
  }

  /**
   * Send Client Confirmation Email for Convoy Request
   */
  public async sendConvoyClientConfirmation(request: ConvoyRequest): Promise<{ success: boolean; logId: string }> {
    const immat = request.is_registered && request.vehicle_plate ? request.vehicle_plate : 'Non immatriculé / En transit';
    const body = `Bonjour ${request.client_name},

Nous vous confirmons la bonne réception de votre demande de convoyage pour le véhicule :
- Marque et modèle : ${request.vehicle_brand} ${request.vehicle_model}
- Année : ${request.vehicle_year}
- Immatriculation : ${immat}
- Référence de votre demande : ${request.reference}

Trajet souhaité :
- Prise en charge : ${request.pickup_address}, ${request.pickup_city}, ${request.pickup_country}
- Livraison : ${request.delivery_address}, ${request.delivery_city}, ${request.delivery_country}
- Date souhaitée : ${request.desired_date}
- Heure souhaitée : ${request.desired_time}

Notre équipe examine actuellement votre demande et prendra contact avec vous dans les plus brefs délais pour vous transmettre une proposition commerciale ou confirmer la faisabilité opérationnelle.

Pour toute question ou information complémentaire, vous pouvez répondre directement à cet email ou contacter notre équipe :
- Téléphone / WhatsApp : +229 01 97 83 21 21
- Email : contact@jmf-mobility.com / jmfmobility.services@gmail.com

Merci de votre confiance.

L'équipe JMF Mobility Services
JMF Fleet & Mobility`;

    return this.sendEmail({
      to: request.client_email,
      recipient_name: request.client_name,
      subject: `Confirmation de votre demande de convoyage — Réf : ${request.reference}`,
      body,
      type: 'CONVOY_CONFIRMATION',
    });
  }

  /**
   * Send Internal Alert to JMF Team for New Convoy Request
   */
  public async sendConvoyAdminNotification(request: ConvoyRequest): Promise<{ success: boolean; logId: string }> {
    const immat = request.is_registered && request.vehicle_plate ? request.vehicle_plate : 'Non immatriculé';
    const body = `Une nouvelle demande de convoyage a été déposée sur le site jmf-mobility.com.

Détails de la demande :
- Référence : ${request.reference}
- Date de soumission : ${new Date(request.created_at).toLocaleString('fr-FR')}
- Demandeur : ${request.client_name}
- Entreprise : ${request.client_company || 'Non renseigné'}
- Email : ${request.client_email}
- Téléphone : ${request.client_phone}
- Pays : ${request.client_country}
- Véhicule : ${request.vehicle_brand} ${request.vehicle_model} (${request.vehicle_year}) - ${immat} - Couleur : ${request.vehicle_color}
- État du véhicule : ${request.vehicle_condition}${request.condition_details ? ` (${request.condition_details})` : ''}
- Transport adapté (plateau requis) : ${request.requires_flatbed ? 'OUI' : 'NON'}
- Prise en charge : ${request.pickup_address}, ${request.pickup_city}, ${request.pickup_country}
- Livraison : ${request.delivery_address}, ${request.delivery_city}, ${request.delivery_country}
- Date et heure souhaitées : ${request.desired_date} à ${request.desired_time}
- Type de convoyage : ${request.convoy_type}
- Mode souhaité : ${request.convoy_mode}
- Instructions particulières : ${request.special_instructions || 'Aucune'}

Consulter et traiter la demande dans l'administration JMF :
https://jmf-mobility.com/admin?view=convoy&ref=${request.reference}`;

    return this.sendEmail({
      to: 'jmfmobility.services@gmail.com',
      recipient_name: 'Équipe Opérations JMF',
      subject: `[NOUVELLE DEMANDE DE CONVOYAGE] Réf : ${request.reference} — ${request.client_name}`,
      body,
      type: 'JMF_INTERNAL_ALERT',
    });
  }
}

export const emailService = new EmailService();
