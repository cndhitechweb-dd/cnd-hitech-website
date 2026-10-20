import heroBgImg from '../imports/hero-bg.jpg'

export interface IndustryApplication {
  title: string
  desc: string
  iconPath: string
}

export interface Industry {
  slug: string
  name: string
  shortDesc: string
  cardImg: string
  heroImg: string
  eyebrow: string
  heroHeading: string
  heroSub: string
  aboutHeading: string
  aboutBody: string[]
  aboutImg: string
  applications: IndustryApplication[]
  productGroupLabels: string[]  // maps to CATEGORY_GROUPS labels from products.ts
}

// ── Shared icon paths ─────────────────────────────────────────────────────────

const ICONS = {
  building: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
  tank: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  process: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  safety: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z',
  power: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
  fire: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z',
  pump: 'M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  zone: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  lab: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15l-1.575.4A11.965 11.965 0 0112 17h0a11.965 11.965 0 01-6.225-1.6L4.2 15m15.6 0l-1.8 7.2a1.5 1.5 0 01-1.457 1.15H7.457A1.5 1.5 0 016 22.2l-1.8-7.2',
  turbine: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z',
  spray: 'M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z',
}

// ── Industry definitions ──────────────────────────────────────────────────────

export const INDUSTRIES: Industry[] = [
  {
    slug: 'oil-gas',
    name: 'Oil & Gas',
    shortDesc: 'Certified explosion-proof equipment for onshore and offshore oil & gas processing facilities.',
    cardImg: 'https://images.unsplash.com/photo-1523294587484-bae6cc870010?w=700&h=480&q=80&fit=crop',
    heroImg: heroBgImg,
    eyebrow: 'OIL & GAS',
    heroHeading: 'Explosion-Proof Solutions for Oil & Gas',
    heroSub: 'CND Hi-Tech supplies certified flameproof and explosion-proof lighting, junction boxes, control stations and communication equipment for Zone 1 & Zone 2 hazardous areas across onshore and offshore oil & gas facilities.',
    aboutHeading: 'Oil & Gas Industry',
    aboutBody: [
      'The oil & gas sector demands the highest standards of electrical safety. From upstream extraction to downstream refining, facilities handle volatile hydrocarbons under high pressure and temperature — creating persistent Zone 1 and Zone 2 hazardous atmospheres where standard electrical equipment would pose an unacceptable ignition risk.',
      'CND Hi-Tech supplies explosion-proof, flameproof (Ex d) and increased-safety (Ex e) certified equipment designed to operate safely within these classified areas. All products conform to IS/IEC 60079 standards and carry CIMFR, PESO, BIS and IECEx approvals where applicable.',
      'Our product range covers the complete electrical infrastructure requirements for oil & gas installations — from weatherproof floodlights for open process areas to flameproof junction boxes for instrumentation wiring and interlocked plug & socket assemblies for portable equipment power.',
    ],
    aboutImg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&h=600&q=80&fit=crop',
    applications: [
      { title: 'Refineries & Process Units', desc: 'Flameproof lighting and control equipment for distillation columns, reaction vessels and process piping corridors.', iconPath: ICONS.building },
      { title: 'Storage & Tank Farms', desc: 'Explosion-proof floodlights, junction boxes and cable glands for above-ground storage tank enclosures.', iconPath: ICONS.tank },
      { title: 'Pumping & Compressor Stations', desc: 'Interlocked plug & sockets, control stations and switches for motor-driven pump and compressor installations.', iconPath: ICONS.pump },
      { title: 'Loading Gantries', desc: 'IP66-rated lighting and weatherproof communication equipment for tanker and rail-car loading facilities.', iconPath: ICONS.process },
      { title: 'Offshore Platforms', desc: 'Marine-grade explosion-proof luminaires and cable glands rated for salt-fog and vibration in offshore environments.', iconPath: ICONS.safety },
      { title: 'Emergency & Alarm Systems', desc: 'Flameproof hooters, flashers and fire alarm stations for hazardous area emergency signalling systems.', iconPath: ICONS.fire },
    ],
    productGroupLabels: ['LIGHT FITTINGS', 'JUNCTION BOXES', 'CONTROL STATIONS', 'PLUG & SOCKETS', 'SWITCHES', 'COMMUNICATION', 'CABLE GLANDS', 'BLANKING PLUGS'],
  },
  {
    slug: 'petrochemical',
    name: 'Petrochemical',
    shortDesc: 'Flameproof lighting and control equipment for petrochemical processing and refining environments.',
    cardImg: 'https://images.unsplash.com/photo-1768564206500-5cddb1fea679?w=700&h=480&q=80&fit=crop',
    heroImg: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1600&h=700&q=80&fit=crop',
    eyebrow: 'PETROCHEMICAL',
    heroHeading: 'Explosion-Proof Solutions for Petrochemical Plants',
    heroSub: 'CND Hi-Tech supplies certified hazardous-area electrical equipment for petrochemical processing environments — from cracking units to storage areas — where flammable vapours and gases demand Ex-rated protection.',
    aboutHeading: 'Petrochemical Industry',
    aboutBody: [
      'Petrochemical facilities convert crude oil and natural gas feedstocks into a wide range of chemical intermediates and finished products. These processes involve large quantities of flammable gases, vapours and liquids under varying pressures and temperatures, resulting in extensive Zone 1 and Zone 2 classified areas throughout the plant.',
      'Electrical equipment installed in these areas must carry recognised hazardous area certifications and be selected according to the applicable gas group and temperature class. CND Hi-Tech products are certified to international Ex standards and comply with Indian regulatory requirements under PESO, CIMFR and BIS.',
      'Our range covers the full scope of electrical infrastructure for petrochemical plants — robust flameproof luminaires for process areas, weatherproof junction boxes for field instrumentation, rated control stations for motor-driven equipment, and certified cable glands for armoured cable terminations.',
    ],
    aboutImg: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&q=80&fit=crop',
    applications: [
      { title: 'Cracking & Reforming Units', desc: 'Flameproof lighting and junction boxes for catalytic cracking and reforming process areas.', iconPath: ICONS.process },
      { title: 'Distillation Columns', desc: 'Ex d certified luminaires and wiring accessories for column structures and associated pipe racks.', iconPath: ICONS.building },
      { title: 'Storage & Transfer Areas', desc: 'IP66 explosion-proof floodlights and control equipment for bulk liquid storage and transfer operations.', iconPath: ICONS.tank },
      { title: 'Loading & Dispatch Facilities', desc: 'Interlocked plug & sockets and weatherproof control stations for tanker loading gantries.', iconPath: ICONS.pump },
      { title: 'Utilities & Offsites', desc: 'Flameproof switches and junction boxes for utility systems including cooling towers and effluent treatment.', iconPath: ICONS.turbine },
      { title: 'Safety & Alarm Systems', desc: 'Certified fire alarm stations, hooters and flashers for hazardous area emergency notification.', iconPath: ICONS.fire },
    ],
    productGroupLabels: ['LIGHT FITTINGS', 'JUNCTION BOXES', 'CONTROL STATIONS', 'SWITCHES', 'COMMUNICATION', 'CABLE GLANDS'],
  },
  {
    slug: 'pharmaceuticals',
    name: 'Pharmaceuticals',
    shortDesc: 'Explosion-proof solutions for pharmaceutical manufacturing with solvent and dust hazard zones.',
    cardImg: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=700&h=480&q=80&fit=crop',
    heroImg: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=1600&h=700&q=80&fit=crop',
    eyebrow: 'PHARMACEUTICALS',
    heroHeading: 'Explosion-Proof Solutions for Pharmaceutical Manufacturing',
    heroSub: 'CND Hi-Tech supplies certified Ex d and Ex tb rated electrical equipment for pharmaceutical plants where flammable solvents, alcohols and combustible dust create Zone 1, Zone 2, Zone 21 and Zone 22 classified areas.',
    aboutHeading: 'Pharmaceutical Industry',
    aboutBody: [
      'Pharmaceutical manufacturing involves significant use of flammable solvents, alcohols, and organic compounds at various stages of active pharmaceutical ingredient (API) synthesis, formulation and packaging. These materials create Zone 1, Zone 2 vapour hazard zones as well as Zone 21 and Zone 22 dust hazard zones in granulation, milling, and drying areas.',
      'Regulatory compliance for hazardous area electrical equipment in pharmaceutical facilities is governed by IS/IEC 60079 for gas/vapour hazards and IS/IEC 60079-31 for dust hazards. CND Hi-Tech supplies products with Ex d (flameproof) and Ex tb (dust-ignition-proof) protection to cover both hazard types.',
      'Our certified luminaires and control equipment are used in solvent handling areas, API manufacturing suites, spray-drying installations, and bulk chemical storage areas where standard equipment cannot be safely installed.',
    ],
    aboutImg: 'https://images.unsplash.com/photo-1583911860205-72f8ac8ddcbe?w=800&h=600&q=80&fit=crop',
    applications: [
      { title: 'API Manufacturing Areas', desc: 'Flameproof lighting and junction boxes for solvent-based API synthesis and reaction suites.', iconPath: ICONS.lab },
      { title: 'Solvent Storage & Handling', desc: 'Ex d rated equipment for bulk solvent tanks, drum stores and solvent dispensing areas.', iconPath: ICONS.tank },
      { title: 'Spray Drying & Granulation', desc: 'Ex tb dust-rated luminaires and switches for powder processing and spray drying installations.', iconPath: ICONS.process },
      { title: 'Packaging & Filling Lines', desc: 'Explosion-proof control stations and switches for packaging equipment in solvent-based coating areas.', iconPath: ICONS.pump },
      { title: 'Clean Room Support Areas', desc: 'IP66 certified luminaires for clean room corridors, gowning areas and material airlocks.', iconPath: ICONS.building },
      { title: 'Emergency & Fire Safety', desc: 'Certified fire alarm stations and audible/visual alarm systems for pharmaceutical hazardous areas.', iconPath: ICONS.fire },
    ],
    productGroupLabels: ['LIGHT FITTINGS', 'JUNCTION BOXES', 'CONTROL STATIONS', 'SWITCHES', 'FIRE ALARM', 'CABLE GLANDS'],
  },
  {
    slug: 'chemicals',
    name: 'Chemicals',
    shortDesc: 'Certified hazardous-area equipment for chemical manufacturing and solvent processing facilities.',
    cardImg: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=700&h=480&q=80&fit=crop',
    heroImg: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1600&h=700&q=80&fit=crop',
    eyebrow: 'CHEMICALS',
    heroHeading: 'Explosion-Proof Solutions for Chemical Manufacturing',
    heroSub: 'CND Hi-Tech supplies flameproof and increased-safety certified equipment for chemical plants handling flammable solvents, reactive compounds and hazardous gases across Zone 1 and Zone 2 classified locations.',
    aboutHeading: 'Chemical Industry',
    aboutBody: [
      'Chemical manufacturing encompasses a broad range of processes — from fine chemicals and speciality chemicals to bulk commodity chemicals and agrochemicals. Many of these processes involve flammable raw materials, solvents and intermediates that create persistent hazardous atmospheres, requiring all electrical equipment to be certified for use in classified areas.',
      'Hazardous area classification in chemical plants is typically performed to IS/IEC 60079-10-1 and results in Zone 1 and Zone 2 areas around reaction vessels, storage tanks, pumping areas and loading facilities. Gas groups IIA, IIB and IIC apply depending on the specific chemicals handled, and CND Hi-Tech products are available across all gas groups.',
      'Our product range — from flameproof luminaires and junction boxes to interlocked plug & sockets and fire alarm stations — provides the complete electrical infrastructure for safe operation of chemical manufacturing facilities.',
    ],
    aboutImg: 'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=800&h=600&q=80&fit=crop',
    applications: [
      { title: 'Reaction Vessels & Batch Plants', desc: 'Flameproof lighting and control stations for batch reactor areas handling flammable solvents.', iconPath: ICONS.process },
      { title: 'Storage Tank Enclosures', desc: 'IP66 explosion-proof luminaires and junction boxes for flammable liquid storage areas.', iconPath: ICONS.tank },
      { title: 'Loading & Dispatch Areas', desc: 'Interlocked plug & sockets and control stations for tanker and drum filling operations.', iconPath: ICONS.pump },
      { title: 'Effluent & Waste Treatment', desc: 'Flameproof switches and junction boxes for effluent treatment areas with flammable off-gases.', iconPath: ICONS.building },
      { title: 'Laboratory & R&D Facilities', desc: 'Ex d certified luminaires for pilot plant and laboratory areas with solvent use.', iconPath: ICONS.lab },
      { title: 'Fire Detection & Alarm', desc: 'Certified fire alarm stations and hooter/flasher units for hazardous area emergency systems.', iconPath: ICONS.fire },
    ],
    productGroupLabels: ['LIGHT FITTINGS', 'JUNCTION BOXES', 'CONTROL STATIONS', 'PLUG & SOCKETS', 'SWITCHES', 'FIRE ALARM', 'CABLE GLANDS'],
  },
  {
    slug: 'paints',
    name: 'Paints',
    shortDesc: 'Explosion-proof electrical equipment for paint manufacturing and industrial coating facilities.',
    cardImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&h=480&q=80&fit=crop',
    heroImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&h=700&q=80&fit=crop',
    eyebrow: 'PAINTS',
    heroHeading: 'Explosion-Proof Solutions for Paint Manufacturing',
    heroSub: 'CND Hi-Tech supplies certified flameproof equipment for paint and coatings manufacturing facilities where solvent vapours, pigment dusts and flammable thinners create Zone 1 and Zone 2 classified areas.',
    aboutHeading: 'Paints & Coatings Industry',
    aboutBody: [
      'Paint and coatings manufacturing involves large quantities of flammable solvents, thinners, resins and pigment dispersions. Mixing, grinding, filling and storage operations all generate hazardous vapour concentrations, creating Zone 1 and Zone 2 classified areas throughout the plant. Dust zones (Zone 21 and Zone 22) can also arise in dry pigment and powder coating areas.',
      'Electrical equipment in these areas must be certified for flammable vapour exposure (Ex d) and in some cases for combustible dust (Ex tb). The correct selection of gas group and temperature class is critical, as different solvent types have different ignition temperatures and explosion characteristics.',
      'CND Hi-Tech supplies a comprehensive range of explosion-proof luminaires, switches, control stations and junction boxes to support the safe electrical infrastructure of paint manufacturing and industrial coatings facilities.',
    ],
    aboutImg: 'https://images.unsplash.com/photo-1605762493946-bf2f7c78fe06?w=800&h=600&q=80&fit=crop',
    applications: [
      { title: 'Mixing & Blending Areas', desc: 'Flameproof lighting and control equipment for solvent-based paint mixing and blending operations.', iconPath: ICONS.process },
      { title: 'Solvent Storage', desc: 'IP66 explosion-proof luminaires and cable glands for solvent tank farms and drum stores.', iconPath: ICONS.tank },
      { title: 'Filling & Packaging Lines', desc: 'Ex d control stations and switches for automatic filling lines handling flammable paint formulations.', iconPath: ICONS.pump },
      { title: 'Spray Booths & Application Areas', desc: 'Certified flameproof lighting for spray booths and areas where flammable coatings are applied.', iconPath: ICONS.spray },
      { title: 'Drying Ovens & Curing Areas', desc: 'Flameproof junction boxes and wiring accessories for oven-associated solvent vapour zones.', iconPath: ICONS.building },
      { title: 'Fire & Emergency Systems', desc: 'Flameproof fire alarm stations and hooters for hazardous area emergency notification.', iconPath: ICONS.fire },
    ],
    productGroupLabels: ['LIGHT FITTINGS', 'JUNCTION BOXES', 'CONTROL STATIONS', 'SWITCHES', 'FIRE ALARM'],
  },
  {
    slug: 'automobiles',
    name: 'Automobiles',
    shortDesc: 'Industrial explosion-proof equipment for automotive paint shops, fuel testing and coating lines.',
    cardImg: 'https://images.unsplash.com/photo-1716191299980-a6e8827ba10b?w=700&h=480&q=80&fit=crop',
    heroImg: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?w=1600&h=700&q=80&fit=crop',
    eyebrow: 'AUTOMOBILES',
    heroHeading: 'Explosion-Proof Solutions for Automotive Manufacturing',
    heroSub: 'CND Hi-Tech supplies certified flameproof electrical equipment for automotive manufacturing environments — specifically paint shops, coating lines, fuel system test cells and finishing areas where flammable vapours are present.',
    aboutHeading: 'Automotive Manufacturing Industry',
    aboutBody: [
      'Automotive manufacturing plants contain several processes that generate flammable atmospheres, most notably the vehicle paint shop and body coating lines where large quantities of solvent-based paints, primers and clear coats are applied in spray booths and drying ovens. Fuel system assembly and engine test cells also create Zone 1 and Zone 2 hazardous areas.',
      'The paint shop environment typically involves solvent vapours from spray application, flash-off zones and drying ovens, all requiring Ex d certified electrical equipment. Temperature classification is particularly important in oven areas where hot surfaces can act as ignition sources.',
      'CND Hi-Tech supplies flameproof luminaires, control stations, switches and junction boxes suitable for use in automotive paint shop environments and fuel system areas — providing safe, reliable electrical infrastructure without compromising production efficiency.',
    ],
    aboutImg: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&h=600&q=80&fit=crop',
    applications: [
      { title: 'Vehicle Paint Shops', desc: 'Flameproof lighting and control stations for spray booths and flash-off zones in automotive paint lines.', iconPath: ICONS.spray },
      { title: 'Body Coating & Primer Lines', desc: 'Ex d certified luminaires and switches for primer application and dip-coating process areas.', iconPath: ICONS.process },
      { title: 'Fuel System Assembly', desc: 'Explosion-proof control stations and junction boxes for fuel tank and fuel system assembly areas.', iconPath: ICONS.tank },
      { title: 'Engine & Powertrain Test Cells', desc: 'Flameproof lighting and wiring accessories for fuel-based engine test cell environments.', iconPath: ICONS.turbine },
      { title: 'Chemical & Solvent Stores', desc: 'IP66-rated luminaires and cable glands for storage of flammable solvents and automotive chemicals.', iconPath: ICONS.building },
      { title: 'Emergency & Safety Systems', desc: 'Certified fire alarm stations and audible alarms for hazardous area emergency signalling in paint facilities.', iconPath: ICONS.fire },
    ],
    productGroupLabels: ['LIGHT FITTINGS', 'JUNCTION BOXES', 'CONTROL STATIONS', 'SWITCHES', 'FIRE ALARM'],
  },
  {
    slug: 'power-plants',
    name: 'Power Plants',
    shortDesc: 'Flameproof and weatherproof equipment for power generation facilities and fuel handling systems.',
    cardImg: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=700&h=480&q=80&fit=crop',
    heroImg: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1600&h=700&q=80&fit=crop',
    eyebrow: 'POWER PLANTS',
    heroHeading: 'Explosion-Proof Solutions for Power Generation',
    heroSub: 'CND Hi-Tech supplies certified flameproof and weatherproof electrical equipment for power generation facilities — covering fuel oil handling, gas turbine areas, HFO storage and cable tunnels where hazardous area certification is required.',
    aboutHeading: 'Power Generation Industry',
    aboutBody: [
      'Power generation facilities — including gas turbine plants, diesel generator stations, combined cycle plants and conventional thermal power stations — contain numerous areas where flammable fuels, lubricating oils and hydraulic fluids create Zone 1 and Zone 2 hazardous locations. Fuel storage and handling systems, turbine enclosures, lube oil systems and cable basements are typical classified areas.',
      'Hazardous area electrical equipment in power plants must comply with IS/IEC 60079 standards. Gas group IIA and IIB classifications are most common for fuel oil and natural gas environments. All CND Hi-Tech explosion-proof products carry the required certifications from CIMFR, PESO and BIS.',
      'Our product range provides complete electrical infrastructure for power plant hazardous areas — from flameproof high-bay luminaires for turbine halls to weatherproof junction boxes for outdoor fuel systems and communication equipment for control room interconnection.',
    ],
    aboutImg: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=800&h=600&q=80&fit=crop',
    applications: [
      { title: 'Turbine & Generator Halls', desc: 'Flameproof and weatherproof high-bay lighting for gas turbine enclosures and generator buildings.', iconPath: ICONS.turbine },
      { title: 'Fuel Oil Storage & Handling', desc: 'Ex d rated luminaires, junction boxes and cable glands for fuel oil tank farms and transfer systems.', iconPath: ICONS.tank },
      { title: 'Lube Oil & Hydraulic Systems', desc: 'Flameproof lighting and control equipment for lube oil treatment and hydraulic power unit areas.', iconPath: ICONS.pump },
      { title: 'Cable Basements & Trenches', desc: 'Explosion-proof junction boxes and cable glands for cable routing through classified basement areas.', iconPath: ICONS.zone },
      { title: 'Control & Switchgear Areas', desc: 'Weatherproof luminaires and communication equipment for control rooms and switchgear buildings.', iconPath: ICONS.power },
      { title: 'Emergency Signalling', desc: 'Certified flameproof hooters, flashers and fire alarm stations for power plant emergency systems.', iconPath: ICONS.fire },
    ],
    productGroupLabels: ['LIGHT FITTINGS', 'JUNCTION BOXES', 'CONTROL STATIONS', 'SWITCHES', 'COMMUNICATION', 'CABLE GLANDS'],
  },
]

export function getIndustryBySlug(slug: string): Industry | undefined {
  return INDUSTRIES.find(i => i.slug === slug)
}
