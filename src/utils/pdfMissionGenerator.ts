import { jsPDF } from 'jspdf';

export interface MissionOrder {
  id: string;
  reference: string;
  companyName: string;
  vehicleReg: string;
  vehicleModel: string;
  vehicleFuelType: string;
  insurancePolicy: string;
  cnsrCertNumber: string;
  driverName: string;
  driverPhone: string;
  driverLicenseNumber: string;
  driverLicenseCategory: string;
  passengers: string[];
  purpose: string;
  departureCity: string;
  destinationCity: string;
  authorizedStops: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  startKm: number;
  estimatedKm: number;
  returnKm?: number;
  fuelAllowanceLiters: number;
  fuelBudgetFcfa: number;
  tollBudgetFcfa: number;
  status: 'ACTIVE' | 'APPROVED' | 'COMPLETED' | 'PENDING';
  authorizerName: string;
  authorizerRole: string;
  issuedAt: string;
}

export function generateMissionOrderPdf(mission: MissionOrder): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 14;

  // Header - République du Bénin
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text('RÉPUBLIQUE DU BÉNIN', pageWidth / 2, y, { align: 'center' });
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('MINISTÈRE DU CADRE DE VIE ET DES TRANSPORTS EN CHARGE DU DÉVELOPPEMENT DURABLE', pageWidth / 2, y, { align: 'center' });
  y += 3.5;
  doc.text('DIRECTION DES TRANSPORTS TERRESTRES • CENTRE NATIONAL DE SÉCURITÉ ROUTIÈRE (CNSR)', pageWidth / 2, y, { align: 'center' });
  y += 5;

  // Line separator with Benin colors (green / yellow / red subtle bar)
  doc.setDrawColor(22, 163, 74); // green
  doc.setLineWidth(0.8);
  doc.line(20, y, pageWidth / 2 - 20, y);
  doc.setDrawColor(234, 179, 8); // yellow
  doc.line(pageWidth / 2 - 19, y, pageWidth / 2 + 19, y);
  doc.setDrawColor(220, 38, 38); // red
  doc.line(pageWidth / 2 + 20, y, pageWidth - 20, y);
  y += 6;

  // Title Box
  doc.setFillColor(15, 23, 42); // slate 900
  doc.rect(20, y, pageWidth - 40, 14, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text('ORDRE DE MISSION DE CIRCULATION INTERURBAINE', pageWidth / 2, y + 6, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(186, 230, 253);
  doc.text(`N° RÉFÉRENCE : ${mission.reference} • DELIVRÉ LE ${mission.issuedAt}`, pageWidth / 2, y + 10.5, { align: 'center' });
  y += 18;

  // Section 1: Entité & Donneur d'ordre
  doc.setFillColor(241, 245, 249);
  doc.rect(20, y, pageWidth - 40, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. ORGANISME ÉMETTEUR & SOCIÉTÉ MANDATAIRE', 23, y + 4.2);
  y += 7.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Entreprise exploitante : ${mission.companyName}`, 24, y);
  doc.text(`Gestionnaire de Flotte délégué : JMF FLEET & MOBILITY BENIN`, 115, y);
  y += 4.5;
  doc.text(`Autorisé par : ${mission.authorizerName} (${mission.authorizerRole})`, 24, y);
  doc.text(`Statut de circulation : AUTORISÉ / CONFORME`, 115, y);
  y += 7;

  // Section 2: Véhicule Assigné
  doc.setFillColor(241, 245, 249);
  doc.rect(20, y, pageWidth - 40, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('2. CARACTÉRISTIQUES DU VÉHICULE ASSIGNÉ (CONFORMITÉ ANaTT / CNSR)', 23, y + 4.2);
  y += 7.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(`Immatriculation : ${mission.vehicleReg}`, 24, y);
  doc.text(`Marque / Modèle : ${mission.vehicleModel}`, 75, y);
  doc.text(`Énergie : ${mission.vehicleFuelType}`, 145, y);
  y += 4.5;
  doc.text(`Police Assurance : ${mission.insurancePolicy}`, 24, y);
  doc.text(`Certificat CNSR : ${mission.cnsrCertNumber}`, 115, y);
  y += 7;

  // Section 3: Conducteur et Équipage
  doc.setFillColor(241, 245, 249);
  doc.rect(20, y, pageWidth - 40, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('3. CONDUCTEUR PRINCIPAL & PASSAGERS AUTORISÉS', 23, y + 4.2);
  y += 7.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Chauffeur désigné : ${mission.driverName}`, 24, y);
  doc.text(`Téléphone mobile : ${mission.driverPhone}`, 115, y);
  y += 4.5;
  doc.text(`Permis de conduire : ${mission.driverLicenseNumber} (Cat. ${mission.driverLicenseCategory})`, 24, y);
  doc.text(`Validité permis : Conforme ANaTT Bénin`, 115, y);
  y += 4.5;
  const passStr = mission.passengers && mission.passengers.length > 0 ? mission.passengers.join(', ') : 'Aucun passager additionnel';
  doc.text(`Passagers / Agents autorisés : ${passStr}`, 24, y);
  y += 7;

  // Section 4: Itinéraire et Objet de la mission
  doc.setFillColor(241, 245, 249);
  doc.rect(20, y, pageWidth - 40, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('4. DÉTAILS DE LA MISSION & ITINÉRAIRE AUTORISÉ', 23, y + 4.2);
  y += 7.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Objet du déplacement : ${mission.purpose}`, 24, y);
  y += 4.5;
  doc.text(`Origine : ${mission.departureCity}`, 24, y);
  doc.text(`Destination principale : ${mission.destinationCity}`, 115, y);
  y += 4.5;
  doc.text(`Escales & Corridors autorisés : ${mission.authorizedStops || 'Itinéraire direct sans déviation'}`, 24, y);
  y += 4.5;
  doc.text(`Période de validité : Du ${mission.startDate} à ${mission.startTime} au ${mission.endDate} à ${mission.endTime}`, 24, y);
  y += 7;

  // Section 5: Kilométrage et Frais de Route
  doc.setFillColor(241, 245, 249);
  doc.rect(20, y, pageWidth - 40, 6, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text('5. RELEVÉ KILOMÉTRIQUE & DOTATIONS DE ROUTE', 23, y + 4.2);
  y += 7.5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Kilométrage compteur de départ : ${mission.startKm.toLocaleString('fr-FR')} km`, 24, y);
  doc.text(`Distance estimée aller-retour : ~${mission.estimatedKm.toLocaleString('fr-FR')} km`, 115, y);
  y += 4.5;
  doc.text(`Dotation carburant allouée : ${mission.fuelAllowanceLiters} Litres (${mission.fuelBudgetFcfa.toLocaleString('fr-FR')} FCFA)`, 24, y);
  doc.text(`Frais de péages & passages : ${mission.tollBudgetFcfa.toLocaleString('fr-FR')} FCFA`, 115, y);
  y += 8;

  // Section 6: Instructions & Recommandations Sécurité Routière
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Rappel réglementaire : Port de la ceinture de sécurité obligatoire. Vitesse maximale limitée à 90 km/h sur corridor et 50 km/h en agglomération. L'usage du téléphone au volant est formellement interdit conformément au code de la route béninois.",
    20,
    y,
    { maxWidth: pageWidth - 40 }
  );
  y += 10;

  // Signatures Box
  const sigY = y;
  const colWidth = (pageWidth - 40) / 3;

  // Box 1: Le Chauffeur
  doc.setDrawColor(203, 213, 225);
  doc.rect(20, sigY, colWidth - 2, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('LE CONDUCTEUR', 23, sigY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Lu et pris engagement', 23, sigY + 8);
  doc.setFont('helvetica', 'italic');
  doc.text(mission.driverName, 23, sigY + 24);

  // Box 2: Visas de passage (Police / Péage)
  doc.rect(20 + colWidth + 1, sigY, colWidth - 2, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CONTRÔLES ROUTIERS / PÉAGE', 20 + colWidth + 4, sigY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Tampon & visa de passage corridor', 20 + colWidth + 4, sigY + 8);

  // Box 3: La Direction / Gestionnaire Flotte
  doc.rect(20 + (colWidth * 2) + 2, sigY, colWidth - 2, 28);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('LA DIRECTION / JMF MOBILITÉ', 20 + (colWidth * 2) + 5, sigY + 4.5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text('Pour ordre et validation', 20 + (colWidth * 2) + 5, sigY + 8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(14, 116, 144);
  doc.text('SIGNATURE & SCEAU NUMÉRIQUE', 20 + (colWidth * 2) + 5, sigY + 16);
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Certifié SHA256-JMF-${mission.reference}`, 20 + (colWidth * 2) + 5, sigY + 24);

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text(
    `JMF FLEET & MOBILITY SERVICES • Siège Cotonou Bénin • Plateforme SaaS de Mobilité d'Entreprise • Document généré le ${new Date().toLocaleString('fr-FR')}`,
    pageWidth / 2,
    288,
    { align: 'center' }
  );

  doc.save(`Ordre_de_Mission_${mission.reference}_${mission.vehicleReg}.pdf`);
}
