import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Car,
  Check,
  ChefHat,
  Clock,
  CreditCard,
  MapPin,
  MessageSquare,
  PackageCheck,
  Paintbrush,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  Store,
  Truck,
} from 'lucide-react';

type DemoAction = 'booking' | 'delivery' | 'quote';

type DemoFormState = {
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  address: string;
  vehicle: string;
};

interface DemoService {
  name: string;
  price: string;
  description: string;
}

interface DemoSite {
  id: string;
  tab: string;
  category: string;
  brand: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  action: DemoAction;
  formTitle: string;
  formNote: string;
  imageUrl: string;
  font: string;
  colors: {
    bg: string;
    surface: string;
    ink: string;
    muted: string;
    accent: string;
    accentStrong: string;
    soft: string;
    line: string;
  };
  metrics: string[];
  trust: string[];
  services: DemoService[];
  gallery: string[];
  testimonial: {
    quote: string;
    name: string;
  };
  contact: {
    phone: string;
    location: string;
    hours: string;
  };
}

const demos: DemoSite[] = [
  {
    id: 'nail-tech',
    tab: 'Nail Tech',
    category: 'Booking Website',
    brand: 'Gloss House',
    eyebrow: 'Private nail studio in Fishtown',
    headline: 'Clean sets, custom art, and a chair that stays booked.',
    subheadline:
      'A polished booking site for independent nail techs who need clients to pick a service, choose a time, and pay a deposit without a DM thread.',
    primaryCta: 'Book a Set',
    secondaryCta: 'View Nail Art',
    action: 'booking',
    formTitle: 'Reserve your chair',
    formNote: 'Deposit-ready checkout, policy copy, and SMS follow-up can be wired in.',
    imageUrl:
      'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1800&q=82',
    font: "'Cormorant Garamond', serif",
    colors: {
      bg: '#fff8f2',
      surface: '#ffffff',
      ink: '#271713',
      muted: '#765f58',
      accent: '#b65360',
      accentStrong: '#6f1e2d',
      soft: '#f4ded8',
      line: '#e7c9c1',
    },
    metrics: ['2 min booking', '24 hr reminders', '40+ art looks'],
    trust: ['Licensed tech', 'Sterile tools', 'Deposit protection'],
    services: [
      {
        name: 'Gel-X Full Set',
        price: '$75',
        description: 'Structured prep, extensions, cuticle care, and glossy finish.',
      },
      {
        name: 'Structured Gel Mani',
        price: '$55',
        description: 'Builder gel strength for natural nails with clean shaping.',
      },
      {
        name: 'Nail Art Add-On',
        price: '$15+',
        description: 'Chrome, aura, French, gems, hand-painted accents, and charms.',
      },
    ],
    gallery: ['Chrome French', 'Aura Almond', 'Milky Builder', 'Gem Accents'],
    testimonial: {
      quote: 'The site makes the studio feel premium before clients even book.',
      name: 'Demo review from a nail client',
    },
    contact: {
      phone: '(215) 555-0144',
      location: 'Fishtown, Philadelphia',
      hours: 'Tue-Sat, 10 AM-7 PM',
    },
  },
  {
    id: 'barber-shop',
    tab: 'Barber',
    category: 'Booking Website',
    brand: 'Crown & Blade',
    eyebrow: 'Neighborhood cuts, sharp scheduling',
    headline: 'A barbershop site built to turn walk-ins into appointments.',
    subheadline:
      'Show prices, barber availability, chair openings, and grooming packages in a fast mobile flow that gets clients in the chair.',
    primaryCta: 'Book a Cut',
    secondaryCta: 'See Services',
    action: 'booking',
    formTitle: 'Grab a chair',
    formNote: 'Great for Square, Calendly, GlossGenius, or a simple request form.',
    imageUrl:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1800&q=82',
    font: "'Bebas Neue', sans-serif",
    colors: {
      bg: '#f4efe6',
      surface: '#fffaf1',
      ink: '#15110e',
      muted: '#6a5b4d',
      accent: '#b21f2d',
      accentStrong: '#0f2b2d',
      soft: '#e8ddcb',
      line: '#d2c0a7',
    },
    metrics: ['4 barbers', 'Same-day slots', 'Hot towel add-ons'],
    trust: ['Walk-ins welcome', 'Card on file optional', 'Kid cuts available'],
    services: [
      {
        name: 'Signature Cut',
        price: '$35',
        description: 'Consult, taper or fade, razor line-up, and style finish.',
      },
      {
        name: 'Cut + Beard',
        price: '$50',
        description: 'Full haircut with beard sculpting, razor work, and balm.',
      },
      {
        name: 'Hot Towel Shave',
        price: '$30',
        description: 'Steam towel, straight razor shave, aftershave, and reset.',
      },
    ],
    gallery: ['Skin Fade', 'Beard Sculpt', 'Classic Taper', 'Kid Cut'],
    testimonial: {
      quote: 'It answers the big questions quickly: price, time, barber, and location.',
      name: 'Demo review from a regular',
    },
    contact: {
      phone: '(267) 555-0199',
      location: 'North Philly, PA',
      hours: 'Mon-Sat, 9 AM-8 PM',
    },
  },
  {
    id: 'tattoo-shop',
    tab: 'Tattoo',
    category: 'Consultation Website',
    brand: 'Black Lantern',
    eyebrow: 'Custom tattoo studio',
    headline: 'Turn flash, portfolios, and consult requests into paid deposits.',
    subheadline:
      'A darker, art-led site for tattoo artists who need to qualify ideas, collect references, explain policies, and book serious clients.',
    primaryCta: 'Request Consult',
    secondaryCta: 'Browse Flash',
    action: 'booking',
    formTitle: 'Start a consult',
    formNote: 'Reference upload, artist selection, and deposit links can be added.',
    imageUrl:
      'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1800&q=82',
    font: "'Archivo Black', sans-serif",
    colors: {
      bg: '#121212',
      surface: '#1d1a18',
      ink: '#f5eee7',
      muted: '#b6a89b',
      accent: '#e64b36',
      accentStrong: '#f5bd48',
      soft: '#2b2522',
      line: '#3c332f',
    },
    metrics: ['3 resident artists', '$80 deposit', 'Custom flash drops'],
    trust: ['Sterile stations', 'Aftercare guide', '18+ policy clear'],
    services: [
      {
        name: 'Custom Piece',
        price: '$150/hr',
        description: 'Artist consult, design direction, placement, and session plan.',
      },
      {
        name: 'Flash Appointment',
        price: '$120+',
        description: 'Ready-to-book designs with clear sizing and artist credit.',
      },
      {
        name: 'Cover-Up Consult',
        price: '$40',
        description: 'Private review for scars, old work, and realistic options.',
      },
    ],
    gallery: ['Fine Line', 'Blackwork', 'Traditional', 'Cover-Up'],
    testimonial: {
      quote: 'The consult flow filters out vague messages and brings better clients.',
      name: 'Demo review from a tattoo artist',
    },
    contact: {
      phone: '(445) 555-0177',
      location: 'South Street, Philadelphia',
      hours: 'Wed-Sun, noon-9 PM',
    },
  },
  {
    id: 'restaurant-delivery',
    tab: 'Restaurant',
    category: 'Delivery Website',
    brand: 'Sizzle Route',
    eyebrow: 'Fast local delivery',
    headline: 'A restaurant delivery page that sells dinner before the apps do.',
    subheadline:
      'Perfect for restaurants that want a direct-order landing page with best sellers, delivery zones, specials, and phone-friendly checkout.',
    primaryCta: 'Start Order',
    secondaryCta: 'View Menu',
    action: 'delivery',
    formTitle: 'Build an order',
    formNote: 'Use it with Toast, Clover, DoorDash Storefront, or direct phone orders.',
    imageUrl:
      'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=1800&q=82',
    font: "'Fraunces', serif",
    colors: {
      bg: '#fff8e8',
      surface: '#fffdf4',
      ink: '#1f231b',
      muted: '#68705e',
      accent: '#d9471f',
      accentStrong: '#19734d',
      soft: '#f4e6bc',
      line: '#e1cd8e',
    },
    metrics: ['30 min average', '$3 local delivery', 'Family bundles'],
    trust: ['Direct ordering', 'Live specials', 'Fresh kitchen photos'],
    services: [
      {
        name: 'Smash Burger Combo',
        price: '$14',
        description: 'Double patty, fries, house pickles, and sauce.',
      },
      {
        name: 'Family Taco Box',
        price: '$38',
        description: 'Twelve tacos, chips, salsa trio, and roasted street corn.',
      },
      {
        name: 'Late Night Wings',
        price: '$16',
        description: 'Ten wings with blue cheese, celery, and heat choice.',
      },
    ],
    gallery: ['Burgers', 'Taco Boxes', 'Wings', 'Kids Meals'],
    testimonial: {
      quote: 'This would help us push direct orders instead of losing people to app fees.',
      name: 'Demo review from a restaurant owner',
    },
    contact: {
      phone: '(215) 555-0188',
      location: '3 mile delivery radius',
      hours: 'Daily, 11 AM-11 PM',
    },
  },
  {
    id: 'mobile-detailing',
    tab: 'Detailing',
    category: 'Quote Website',
    brand: 'Mirror Mile',
    eyebrow: 'Mobile auto detailing',
    headline: 'A premium service site for detailers who pull up and get paid.',
    subheadline:
      'A high-trust quote page for mobile detailers with packages, before-and-after proof, add-ons, and a form that qualifies each vehicle.',
    primaryCta: 'Get a Quote',
    secondaryCta: 'Compare Packages',
    action: 'quote',
    formTitle: 'Quote my vehicle',
    formNote: 'Works for SMS estimates, photo uploads, subscriptions, and deposits.',
    imageUrl:
      'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=1800&q=82',
    font: "'Oswald', sans-serif",
    colors: {
      bg: '#eef5f7',
      surface: '#ffffff',
      ink: '#0e1b22',
      muted: '#536672',
      accent: '#007c89',
      accentStrong: '#f0a202',
      soft: '#d7e8ec',
      line: '#b8cbd1',
    },
    metrics: ['We come to you', 'Fleet plans', 'Ceramic add-ons'],
    trust: ['Insured service', 'Before-after gallery', 'Weather reschedule policy'],
    services: [
      {
        name: 'Express Reset',
        price: '$89',
        description: 'Exterior wash, wheels, tire shine, vacuum, and wipe-down.',
      },
      {
        name: 'Interior Deep Clean',
        price: '$160',
        description: 'Steam, shampoo, leather care, vents, mats, and odor reset.',
      },
      {
        name: 'Paint Protection',
        price: '$240+',
        description: 'Decon wash, clay bar, polish prep, and ceramic sealant.',
      },
    ],
    gallery: ['Interior Reset', 'Paint Gloss', 'Wheel Detail', 'Fleet Wash'],
    testimonial: {
      quote: 'The quote form makes premium packages feel easy to understand.',
      name: 'Demo review from a detailing customer',
    },
    contact: {
      phone: '(610) 555-0166',
      location: 'Philadelphia suburbs',
      hours: 'Mon-Sun, 8 AM-6 PM',
    },
  },
];

const iconByAction = {
  booking: CalendarDays,
  delivery: Truck,
  quote: MessageSquare,
};

const iconByDemo = {
  'nail-tech': Sparkles,
  'barber-shop': Scissors,
  'tattoo-shop': Paintbrush,
  'restaurant-delivery': ChefHat,
  'mobile-detailing': Car,
};

const themeStyle = (demo: DemoSite) =>
  ({
    backgroundColor: demo.colors.bg,
    color: demo.colors.ink,
    fontFamily: "'DM Sans', sans-serif",
  }) as React.CSSProperties;

const actionCopy = {
  booking: 'Appointment request',
  delivery: 'Direct order',
  quote: 'Qualified lead',
};

const initialFormState = (demo: DemoSite): DemoFormState => ({
  service: demo.services[0]?.name ?? '',
  date: '',
  time: '',
  name: '',
  phone: '',
  address: '',
  vehicle: 'Sedan',
});

const ClientDemos: React.FC = () => {
  const [activeId, setActiveId] = useState(demos[0].id);

  useEffect(() => {
    const syncHash = () => {
      const matchedDemo = demos.find((demo) => window.location.hash === `#demo-${demo.id}`);
      if (matchedDemo) {
        setActiveId(matchedDemo.id);
        window.requestAnimationFrame(() => {
          document.getElementById('client-demos')?.scrollIntoView({ block: 'start' });
        });
      }
    };

    syncHash();
    window.addEventListener('hashchange', syncHash);
    return () => window.removeEventListener('hashchange', syncHash);
  }, []);

  const activeDemo = useMemo(
    () => demos.find((demo) => demo.id === activeId) ?? demos[0],
    [activeId],
  );

  const chooseDemo = (id: string) => {
    setActiveId(id);
    window.history.replaceState(null, '', `#demo-${id}`);
  };

  return (
    <section id="client-demos" className="relative overflow-hidden bg-[#f6f1e8] py-24 text-[#171513]">
      <div className="absolute inset-x-0 top-0 h-px bg-black/10" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-bold text-[#6c3d24]">
              <Store className="h-4 w-4" />
              Client demo showroom
            </p>
            <h2 className="max-w-3xl text-4xl font-black leading-[1.05] md:text-6xl">
              Five local business demos made to help close $150 websites.
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {['Booking flows', 'Mobile-first selling', 'Ready to customize'].map((item) => (
              <div key={item} className="border border-black/10 bg-white/75 p-4">
                <Check className="mb-3 h-5 w-5 text-[#0e6b52]" />
                <p className="text-sm font-bold">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-5">
          {demos.map((demo) => {
            const Icon = iconByDemo[demo.id as keyof typeof iconByDemo];
            const isActive = demo.id === activeDemo.id;
            return (
              <button
                key={demo.id}
                type="button"
                onClick={() => chooseDemo(demo.id)}
                className={`group flex min-h-28 flex-col items-start justify-between border p-4 text-left transition ${
                  isActive
                    ? 'border-black bg-[#171513] text-white shadow-2xl'
                    : 'border-black/10 bg-white/80 text-[#171513] hover:-translate-y-1 hover:border-black/30'
                }`}
                aria-pressed={isActive}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                    isActive ? 'bg-white text-[#171513]' : 'bg-[#f0e2cf] text-[#6c3d24]'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-base font-black">{demo.tab}</span>
                  <span className={`text-xs ${isActive ? 'text-white/65' : 'text-black/55'}`}>
                    {demo.category}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 overflow-hidden border border-black/10 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.16)]">
          <div className="flex items-center justify-between border-b border-black/10 bg-[#161616] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff6159]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2f]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <p className="hidden text-xs text-white/60 sm:block">
              jesserodriguez.me/demo/{activeDemo.id}
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-xs font-bold text-white hover:text-[#ffbd2f]"
            >
              Build one <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          <DemoPreview demo={activeDemo} />
        </div>
      </div>
    </section>
  );
};

const DemoPreview: React.FC<{ demo: DemoSite }> = ({ demo }) => {
  const ActionIcon = iconByAction[demo.action];
  const [form, setForm] = useState<DemoFormState>(() => initialFormState(demo));
  const [errors, setErrors] = useState<Partial<Record<keyof DemoFormState, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const today = new Date().toISOString().slice(0, 10);
  const fieldStyle = {
    borderColor: demo.colors.line,
    backgroundColor: demo.colors.bg,
    color: demo.colors.ink,
  };

  useEffect(() => {
    setForm(initialFormState(demo));
    setErrors({});
    setSubmitted(false);
  }, [demo]);

  const updateField = (field: keyof DemoFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof DemoFormState, string>> = {};

    if (!form.service) {
      nextErrors.service = demo.action === 'delivery' ? 'Choose a menu item.' : 'Choose a service.';
    }
    if (!form.date) {
      nextErrors.date = demo.action === 'quote' ? 'Pick a preferred day.' : 'Pick a date.';
    }
    if (demo.action !== 'quote' && !form.time) {
      nextErrors.time = demo.action === 'delivery' ? 'Choose a delivery time.' : 'Choose a time.';
    }
    if (!form.name.trim()) {
      nextErrors.name = 'Add a customer name.';
    }
    if (!form.phone.trim()) {
      nextErrors.phone = 'Add a phone number.';
    }
    if (demo.action === 'delivery' && !form.address.trim()) {
      nextErrors.address = 'Add a delivery address.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
    }
  };

  return (
    <article style={themeStyle(demo)} className="min-h-[760px]">
      <header
        className="flex flex-col gap-4 border-b px-5 py-5 md:flex-row md:items-center md:justify-between md:px-8"
        style={{ borderColor: demo.colors.line, backgroundColor: demo.colors.surface }}
      >
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 items-center justify-center rounded-full font-black"
            style={{ backgroundColor: demo.colors.ink, color: demo.colors.bg }}
          >
            {demo.brand
              .split(' ')
              .map((word) => word[0])
              .slice(0, 2)
              .join('')}
          </span>
          <div>
            <p className="text-2xl leading-none" style={{ fontFamily: demo.font }}>
              {demo.brand}
            </p>
            <p className="text-xs font-bold uppercase" style={{ color: demo.colors.muted }}>
              {demo.category}
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm font-bold" aria-label={`${demo.brand} demo`}>
          {['Services', 'Proof', 'Contact'].map((item) => (
            <a key={item} href={`#${demo.id}-${item.toLowerCase()}`} style={{ color: demo.colors.muted }}>
              {item}
            </a>
          ))}
          <a
            href={`#${demo.id}-form`}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-black"
            style={{ backgroundColor: demo.colors.accent, color: demo.colors.surface }}
          >
            {demo.primaryCta}
            <ArrowRight className="h-4 w-4" />
          </a>
        </nav>
      </header>

      <section className="relative min-h-[570px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(90deg, ${demo.colors.bg} 0%, ${demo.colors.bg} 22%, rgba(0,0,0,0.22) 100%), url(${demo.imageUrl})`,
          }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: `${demo.colors.ink}12` }} />

        <div className="relative grid min-h-[570px] gap-8 px-5 py-10 md:grid-cols-[1fr_420px] md:px-8 lg:px-12">
          <div className="flex max-w-2xl flex-col justify-center">
            <p
              className="mb-5 inline-flex w-fit items-center gap-2 px-4 py-2 text-sm font-black"
              style={{ backgroundColor: demo.colors.surface, color: demo.colors.accentStrong }}
            >
              <ShieldCheck className="h-4 w-4" />
              {demo.eyebrow}
            </p>
            <h1 className="text-5xl leading-[0.95] md:text-7xl" style={{ fontFamily: demo.font }}>
              {demo.headline}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8" style={{ color: demo.colors.muted }}>
              {demo.subheadline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`#${demo.id}-form`}
                className="inline-flex items-center gap-2 px-5 py-3 text-sm font-black"
                style={{ backgroundColor: demo.colors.accent, color: demo.colors.surface }}
              >
                {demo.primaryCta}
                <ActionIcon className="h-5 w-5" />
              </a>
              <a
                href={`#${demo.id}-services`}
                className="inline-flex items-center gap-2 border px-5 py-3 text-sm font-black"
                style={{ borderColor: demo.colors.ink, backgroundColor: `${demo.colors.surface}d9` }}
              >
                {demo.secondaryCta}
              </a>
            </div>
          </div>

          <div
            className="self-center border p-4 shadow-[0_24px_70px_rgba(0,0,0,0.22)]"
            style={{ backgroundColor: `${demo.colors.surface}f2`, borderColor: demo.colors.line }}
          >
            <div id={`${demo.id}-form`} className="mb-4 flex scroll-mt-24 items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase" style={{ color: demo.colors.accent }}>
                  {actionCopy[demo.action]}
                </p>
                <h3 className="text-2xl font-black">{demo.formTitle}</h3>
              </div>
              <span
                className="flex h-11 w-11 items-center justify-center rounded-full"
                style={{ backgroundColor: demo.colors.soft, color: demo.colors.accentStrong }}
              >
                <ActionIcon className="h-5 w-5" />
              </span>
            </div>

            <form
              onSubmit={submitForm}
              noValidate
              className="grid gap-3"
              aria-label={`${demo.brand} ${demo.action} form`}
            >
              <label className="grid gap-1 text-sm font-bold">
                <span style={{ color: demo.colors.muted }}>
                  {demo.action === 'delivery' ? 'Menu item' : demo.action === 'quote' ? 'Package' : 'Service'}
                </span>
                <select
                  value={form.service}
                  onChange={(event) => updateField('service', event.target.value)}
                  className="w-full border px-4 py-3 text-sm font-bold outline-none focus:ring-2"
                  style={{ ...fieldStyle, ['--tw-ring-color' as string]: demo.colors.accent }}
                  aria-invalid={Boolean(errors.service)}
                >
                  {demo.services.map((service) => (
                    <option key={service.name} value={service.name}>
                      {service.name} - {service.price}
                    </option>
                  ))}
                </select>
                <FieldError message={errors.service} color={demo.colors.accent} />
              </label>

              {demo.action === 'quote' && (
                <label className="grid gap-1 text-sm font-bold">
                  <span style={{ color: demo.colors.muted }}>Vehicle type</span>
                  <select
                    value={form.vehicle}
                    onChange={(event) => updateField('vehicle', event.target.value)}
                    className="w-full border px-4 py-3 text-sm font-bold outline-none focus:ring-2"
                    style={{ ...fieldStyle, ['--tw-ring-color' as string]: demo.colors.accent }}
                  >
                    {['Sedan', 'SUV', 'Truck', 'Fleet vehicle'].map((vehicle) => (
                      <option key={vehicle} value={vehicle}>
                        {vehicle}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {demo.action === 'delivery' && (
                <label className="grid gap-1 text-sm font-bold">
                  <span style={{ color: demo.colors.muted }}>Delivery address</span>
                  <input
                    value={form.address}
                    onChange={(event) => updateField('address', event.target.value)}
                    className="w-full border px-4 py-3 text-sm font-bold outline-none placeholder:font-medium focus:ring-2"
                    style={{ ...fieldStyle, ['--tw-ring-color' as string]: demo.colors.accent }}
                    placeholder="123 Market St"
                    aria-invalid={Boolean(errors.address)}
                  />
                  <FieldError message={errors.address} color={demo.colors.accent} />
                </label>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-bold">
                  <span style={{ color: demo.colors.muted }}>
                    {demo.action === 'quote' ? 'Preferred day' : 'Date'}
                  </span>
                  <input
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={(event) => updateField('date', event.target.value)}
                    className="w-full border px-4 py-3 text-sm font-bold outline-none focus:ring-2"
                    style={{ ...fieldStyle, ['--tw-ring-color' as string]: demo.colors.accent }}
                    aria-invalid={Boolean(errors.date)}
                  />
                  <FieldError message={errors.date} color={demo.colors.accent} />
                </label>

                {demo.action !== 'quote' && (
                  <label className="grid gap-1 text-sm font-bold">
                    <span style={{ color: demo.colors.muted }}>
                      {demo.action === 'delivery' ? 'Ready time' : 'Time'}
                    </span>
                    <select
                      value={form.time}
                      onChange={(event) => updateField('time', event.target.value)}
                      className="w-full border px-4 py-3 text-sm font-bold outline-none focus:ring-2"
                      style={{ ...fieldStyle, ['--tw-ring-color' as string]: demo.colors.accent }}
                      aria-invalid={Boolean(errors.time)}
                    >
                      <option value="">Choose</option>
                      {['ASAP', '10:30 AM', '12:00 PM', '2:30 PM', '5:30 PM', '7:00 PM'].map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    <FieldError message={errors.time} color={demo.colors.accent} />
                  </label>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-bold">
                  <span style={{ color: demo.colors.muted }}>Your name</span>
                  <input
                    value={form.name}
                    onChange={(event) => updateField('name', event.target.value)}
                    className="w-full border px-4 py-3 text-sm font-bold outline-none placeholder:font-medium focus:ring-2"
                    style={{ ...fieldStyle, ['--tw-ring-color' as string]: demo.colors.accent }}
                    placeholder="Client name"
                    aria-invalid={Boolean(errors.name)}
                  />
                  <FieldError message={errors.name} color={demo.colors.accent} />
                </label>

                <label className="grid gap-1 text-sm font-bold">
                  <span style={{ color: demo.colors.muted }}>Phone</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    className="w-full border px-4 py-3 text-sm font-bold outline-none placeholder:font-medium focus:ring-2"
                    style={{ ...fieldStyle, ['--tw-ring-color' as string]: demo.colors.accent }}
                    placeholder="(215) 555-0199"
                    aria-invalid={Boolean(errors.phone)}
                  />
                  <FieldError message={errors.phone} color={demo.colors.accent} />
                </label>
              </div>

              <button
                type="submit"
                className="mt-1 flex w-full items-center justify-center gap-2 px-5 py-4 text-sm font-black outline-none transition hover:scale-[1.01] focus:ring-2"
                style={{
                  backgroundColor: demo.colors.ink,
                  color: demo.colors.bg,
                  ['--tw-ring-color' as string]: demo.colors.accent,
                }}
              >
                {demo.primaryCta}
                <CreditCard className="h-4 w-4" />
              </button>
            </form>

            {submitted && (
              <div
                role="status"
                className="mt-3 flex items-start gap-3 border p-3 text-sm font-bold"
                style={{ borderColor: demo.colors.accent, backgroundColor: demo.colors.soft }}
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0" style={{ color: demo.colors.accent }} />
                <span>
                  Demo confirmation: {demo.action === 'delivery' ? 'order started' : 'request received'} for {form.name}.
                </span>
              </div>
            )}

            <p className="mt-3 text-xs leading-5" style={{ color: demo.colors.muted }}>
              {demo.formNote}
            </p>
          </div>
        </div>
      </section>

      <section className="grid border-y md:grid-cols-3" style={{ borderColor: demo.colors.line }}>
        {demo.metrics.map((metric) => (
          <div key={metric} className="flex items-center gap-3 border-b p-5 md:border-b-0 md:border-r" style={{ borderColor: demo.colors.line }}>
            <Star className="h-5 w-5" style={{ color: demo.colors.accentStrong }} />
            <p className="font-black">{metric}</p>
          </div>
        ))}
      </section>

      <section id={`${demo.id}-services`} className="grid gap-8 px-5 py-12 md:grid-cols-[0.75fr_1.25fr] md:px-8 lg:px-12">
        <div>
          <p className="mb-3 text-sm font-black uppercase" style={{ color: demo.colors.accent }}>
            Built to convert
          </p>
          <h2 className="text-4xl leading-none md:text-5xl" style={{ fontFamily: demo.font }}>
            Clear offers, clear proof, clear next step.
          </h2>
          <div className="mt-6 grid gap-3">
            {demo.trust.map((trust) => (
              <p key={trust} className="flex items-center gap-3 text-sm font-bold">
                <Check className="h-5 w-5" style={{ color: demo.colors.accent }} />
                {trust}
              </p>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {demo.services.map((service) => (
            <div key={service.name} className="border p-5" style={{ borderColor: demo.colors.line, backgroundColor: demo.colors.surface }}>
              <p className="text-sm font-black" style={{ color: demo.colors.accent }}>
                {service.price}
              </p>
              <h3 className="mt-3 text-2xl leading-none" style={{ fontFamily: demo.font }}>
                {service.name}
              </h3>
              <p className="mt-4 text-sm leading-6" style={{ color: demo.colors.muted }}>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id={`${demo.id}-proof`} className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
        <div className="grid grid-cols-2">
          {demo.gallery.map((item, index) => (
            <div
              key={item}
              className="min-h-32 border-t border-r p-5"
              style={{
                borderColor: demo.colors.line,
                backgroundColor: index % 2 === 0 ? demo.colors.soft : demo.colors.surface,
              }}
            >
              <p className="text-3xl leading-none" style={{ fontFamily: demo.font }}>
                {item}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t p-6 md:p-8" style={{ borderColor: demo.colors.line, backgroundColor: demo.colors.ink, color: demo.colors.bg }}>
          <div className="mb-6 flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} className="h-5 w-5 fill-current" style={{ color: demo.colors.accentStrong }} />
            ))}
          </div>
          <blockquote className="text-2xl leading-9 md:text-3xl" style={{ fontFamily: demo.font }}>
            "{demo.testimonial.quote}"
          </blockquote>
          <p className="mt-5 text-sm font-bold opacity-75">{demo.testimonial.name}</p>
        </div>
      </section>

      <footer
        id={`${demo.id}-contact`}
        className="grid gap-5 px-5 py-8 md:grid-cols-[1fr_auto] md:items-center md:px-8 lg:px-12"
        style={{ backgroundColor: demo.colors.surface }}
      >
        <div className="grid gap-3 md:grid-cols-3">
          <ContactPill
            icon={<Phone className="h-4 w-4" />}
            label={demo.contact.phone}
            color={demo.colors.accent}
            href={`tel:${demo.contact.phone.replace(/[^0-9]/g, '')}`}
          />
          <ContactPill
            icon={<MapPin className="h-4 w-4" />}
            label={demo.contact.location}
            color={demo.colors.accent}
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(demo.contact.location)}`}
          />
          <ContactPill icon={<Clock className="h-4 w-4" />} label={demo.contact.hours} color={demo.colors.accent} />
        </div>

        <a
          href={`#${demo.id}-form`}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-black"
          style={{ backgroundColor: demo.colors.accent, color: demo.colors.surface }}
        >
          {demo.primaryCta}
          <PackageCheck className="h-4 w-4" />
        </a>
      </footer>
    </article>
  );
};

const FieldError: React.FC<{ message?: string; color: string }> = ({ message, color }) => (
  message ? (
    <span className="text-xs font-bold" style={{ color }} role="alert">
      {message}
    </span>
  ) : null
);

const ContactPill: React.FC<{ icon: React.ReactNode; label: string; color: string; href?: string }> = ({
  icon,
  label,
  color,
  href,
}) => {
  const content = (
    <>
      <span style={{ color }}>{icon}</span>
      {label}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith('http') ? '_blank' : undefined}
        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
        className="flex items-center gap-2 text-sm font-bold underline-offset-4 hover:underline"
      >
        {content}
      </a>
    );
  }

  return (
    <p className="flex items-center gap-2 text-sm font-bold">
      {content}
    </p>
  );
};

export default ClientDemos;
