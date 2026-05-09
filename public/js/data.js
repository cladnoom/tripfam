// Static trip content. Notes & suggestions are synced via the API.
window.TRIP_DATA = {
  trip: {
    title: 'Malaysia Family Trip',
    subtitle: '10 Days · 10 Nights',
    travellers: '3–4 travellers',
    departure: '25 May 2026',
    return: '3 June 2026',
    route: 'Kuala Lumpur → Penang → Langkawi'
  },

  cities: [
    {
      id: 'kl',
      name: 'Kuala Lumpur',
      shortName: 'KL',
      tagline: 'Skyscrapers, street food, sacred caves',
      dates: 'May 25 – 28',
      nights: 4,
      accent: 'amber',
      heroGradient: 'linear-gradient(135deg, #d97706 0%, #b45309 50%, #78350f 100%)',
      days: [
        {
          id: 'kl-day1',
          number: 1,
          date: 'Mon · May 25',
          title: 'KL Iconic First Night',
          subtitle: 'Touch down, settle in, soak up the skyline',
          activities: [
            { tag: 'Arrive', text: 'Arrive & check in around KLCC / Bukit Bintang' },
            { tag: 'Must-do', text: 'Petronas Twin Towers + Skybridge', detail: 'Book online · RM 80 / adult · Sunset slot recommended' },
            { tag: 'Free', text: 'KLCC Park stroll — fountains light up at 8pm' },
            { tag: 'Food', text: 'Jalan Alor Food Street', detail: 'BBQ stingray · Char Kway Teow · Satay' }
          ]
        },
        {
          id: 'kl-day2',
          number: 2,
          date: 'Tue · May 26',
          title: 'Culture & Heritage',
          subtitle: 'Caves, temples, markets, old-town charm',
          activities: [
            { tag: 'Must-do', text: 'Batu Caves', detail: 'Go 7–8 am · Free · 272 steps · Watch the monkeys' },
            { tag: 'Free', text: 'Thean Hou Temple — panoramic views over the city' },
            { tag: 'Tip', text: 'Central Market + Petaling Street', detail: 'Bargain hard · Half the asking price is fair' },
            { tag: 'Free', text: 'Merdeka Square — colonial architecture, big flag' },
            { tag: 'Food', text: 'Changkat Bukit Bintang — dinner & nightlife' }
          ]
        },
        {
          id: 'kl-day3',
          number: 3,
          date: 'Wed · May 27',
          title: 'Adventure Day',
          subtitle: 'Theme park thrills',
          activities: [
            { tag: 'Must-do', text: 'Sunway Lagoon Theme Park', detail: 'Full day · ~RM 500–600 for the family · 6 parks in one' },
            { tag: 'Food', text: 'Dinner at Pavilion KL or TRX Exchange' }
          ]
        },
        {
          id: 'kl-day4',
          number: 4,
          date: 'Thu · May 28',
          title: 'Putrajaya + Transfer to Penang',
          subtitle: 'Pink mosques and short flights',
          activities: [
            { tag: 'Free', text: 'Putra Mosque, Putrajaya', detail: 'Rose-pink dome · Arrive early to avoid the heat' },
            { tag: 'Transfer', text: 'Afternoon flight KL → Penang', detail: 'AirAsia / Firefly from KLIA2 · ~RM 80 / person · 1h flight' }
          ]
        }
      ]
    },
    {
      id: 'penang',
      name: 'Penang',
      shortName: 'Penang',
      tagline: 'Heritage, hawkers, hill stations',
      dates: 'May 29 – 31',
      nights: 3,
      accent: 'teal',
      heroGradient: 'linear-gradient(135deg, #14b8a6 0%, #0f766e 50%, #134e4a 100%)',
      days: [
        {
          id: 'penang-day5',
          number: 5,
          date: 'Fri · May 29',
          title: 'George Town Heritage',
          subtitle: 'Street art, clan jetties, hawker heaven',
          activities: [
            { tag: 'Free', text: 'George Town street art walk', detail: 'Start on Armenian Street · Bring a camera' },
            { tag: 'Free', text: 'Chew Jetty clan village — stilted homes over the water' },
            { tag: 'Must-do', text: 'Blue Mansion / Cheong Fatt Tze', detail: 'Guided tour · RM 20' },
            { tag: 'Free', text: 'Fort Cornwallis + Kapitan Keling Mosque' },
            { tag: 'Free', text: 'Hin Bus Depot art centre' },
            { tag: 'Food', text: 'Gurney Drive → New Lane Hawker Centre', detail: 'Char Kway Teow · Asam Laksa · Nasi Kandar · Cendol' }
          ]
        },
        {
          id: 'penang-day6',
          number: 6,
          date: 'Sat · May 30',
          title: 'Penang Hill + Activities',
          subtitle: 'Temples, funicular, beach by night',
          activities: [
            { tag: 'Must-do', text: 'Kek Lok Si Temple', detail: 'Arrive before 9am · Mostly free · Optional cable car to pagoda' },
            { tag: 'Must-do', text: 'Penang Hill Funicular + The Habitat', detail: 'Funicular RM 30 · Habitat nature walk RM 58 / adult' },
            { tag: 'Pick one', text: 'Upside Down Museum + 3D Trick Art', detail: 'Best for families with kids' },
            { tag: 'Pick one', text: 'Penang Peranakan Mansion', detail: 'Best for history lovers' },
            { tag: 'Food', text: 'Batu Ferringhi night market & beach bars' }
          ]
        },
        {
          id: 'penang-day7',
          number: 7,
          date: 'Sun · May 31',
          title: 'Adventure + Transfer to Langkawi',
          subtitle: 'Last Penang thrills, then island time',
          activities: [
            { tag: 'Pick one', text: 'ESCAPE Penang outdoor adventure park', detail: 'RM 95 / person · Active families' },
            { tag: 'Pick one', text: 'Entopia Butterfly Farm', detail: 'RM 60 / adult · Younger kids' },
            { tag: 'Free', text: 'Tanjung Bungah Floating Mosque' },
            { tag: 'Tip', text: 'Beach swim + parasailing', detail: '~RM 80 for parasailing' },
            { tag: 'Transfer', text: 'Evening: Ferry Penang → Langkawi', detail: 'Swettenham Pier · ~2.5 hrs · RM 70 / adult · Or AirAsia flight if seas are rough' }
          ]
        }
      ]
    },
    {
      id: 'langkawi',
      name: 'Langkawi',
      shortName: 'Langkawi',
      tagline: 'Cable cars, island hopping, sunset cruises',
      dates: 'Jun 1 – 3',
      nights: 3,
      accent: 'blue',
      heroGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 50%, #1e3a8a 100%)',
      days: [
        {
          id: 'langkawi-day8',
          number: 8,
          date: 'Mon · Jun 1',
          title: 'SkyCab & Beach Night',
          subtitle: 'Up high, then sand between toes',
          activities: [
            { tag: 'Must-do', text: 'Langkawi SkyCab cable car', detail: 'RM 55 / adult · Go before 10am to beat clouds' },
            { tag: 'Must-do', text: 'Langkawi SkyBridge', detail: 'Glass-bottom suspended bridge · Not for vertigo' },
            { tag: 'Free', text: 'Pantai Cenang beach — wide soft sand' },
            { tag: 'Tip', text: 'Underwater World Langkawi', detail: 'RM 53 / adult · Air-con afternoon escape' },
            { tag: 'Food', text: 'Cenang Beach by night — fire shows, cafés, cocktails' }
          ]
        },
        {
          id: 'langkawi-day9',
          number: 9,
          date: 'Tue · Jun 2',
          title: 'Island Hopping',
          subtitle: 'Boats, snorkels, eagles',
          activities: [
            { tag: 'Must-do', text: 'Island hopping tour from Jetty Point', detail: '~RM 35–45 / person · Pregnant Maiden lake swim · Beras Basah · Eagle watching' },
            { tag: 'Tip', text: 'Jet skiing — ~RM 120 / 15 min' },
            { tag: 'Tip', text: 'Parasailing — ~RM 80 / person' },
            { tag: 'Food', text: 'Pasar Malam (night market)' }
          ]
        },
        {
          id: 'langkawi-day10',
          number: 10,
          date: 'Wed · Jun 3',
          title: 'Nature & Sunset Cruise',
          subtitle: 'Mangroves at dawn, yacht at dusk',
          activities: [
            { tag: 'Must-do', text: 'Kilim Karst Geoforest mangrove boat tour', detail: 'RM 80–100 / person · 3 hrs · Eagles, caves, fish farms' },
            { tag: 'Free', text: 'Final beach swim at Pantai Cenang' },
            { tag: 'Must-do', text: 'Sunset yacht cruise', detail: '~RM 100–150 / person · 2 hrs from Telaga Harbour Marina' },
            { tag: 'Food', text: 'Final seafood dinner — The Cliff or Bon Ton Restaurant' },
            { tag: 'Transfer', text: 'Return flight Langkawi → KL', detail: '~RM 80 · 55 min · Then onward home' }
          ]
        }
      ]
    }
  ],

  hotels: [
    // KL
    { city: 'kl', cityName: 'Kuala Lumpur', name: 'Scarletz Suites KLCC', type: 'apartment', price: 35, location: 'KLCC', pros: ['Walk to Petronas Towers', 'Pool with skyline view', 'Family-size suites with kitchen', 'Self check-in flexibility'], familyFit: 'Two-bedroom suites comfortably sleep 4 — kitchen for breakfast saves on eating out.', link: 'https://www.airbnb.com' },
    { city: 'kl', cityName: 'Kuala Lumpur', name: 'Eaton Residences KLCC', type: 'apartment', price: 45, location: 'KLCC', pros: ['Modern serviced apartment', 'Rooftop infinity pool', '5 min walk to KLCC park', 'Washing machine in room'], familyFit: 'Living room separates kid bedtime from parent wind-down — laundry mid-trip is a win.', link: 'https://www.airbnb.com' },
    { city: 'kl', cityName: 'Kuala Lumpur', name: 'Swing & Pillows Bukit Bintang', type: 'budget', price: 16, location: 'Bukit Bintang', pros: ['Walking distance to Jalan Alor', 'Tidy budget rooms', 'Excellent for short stays', '24h reception'], familyFit: 'Best for two adjoining rooms rather than a family suite — cheapest option in the centre.', link: 'https://www.booking.com' },
    { city: 'kl', cityName: 'Kuala Lumpur', name: 'The Chow Kit', type: 'mid', price: 70, location: 'Chow Kit', pros: ['Boutique design hotel', 'On the monorail line', 'Excellent in-house café', 'Family rooms available'], familyFit: 'Tasteful, design-forward family rooms for 4 with proper bedding for everyone.', link: 'https://thechowkit.com' },
    { city: 'kl', cityName: 'Kuala Lumpur', name: 'The RuMa Hotel', type: 'luxury', price: 120, location: 'KLCC', pros: ['5-star with personal touch', 'Heated infinity pool', 'Walk to Petronas Towers', 'Complimentary minibar'], familyFit: 'Connecting rooms on request — staff treat kids like VIPs.', link: 'https://www.theruma.com' },

    // Penang
    { city: 'penang', cityName: 'Penang', name: 'Kimberley Hotel George Town', type: 'budget', price: 22, location: 'George Town', pros: ['Centre of street-food district', 'Walk to Chew Jetty', 'Clean, simple, well-reviewed', 'Free breakfast'], familyFit: 'Family quad rooms exist — ask when booking. Steps from the best hawker stalls.', link: 'https://www.booking.com' },
    { city: 'penang', cityName: 'Penang', name: 'Rare Heritage Hotel', type: 'mid', price: 32, location: 'George Town', pros: ['Restored shophouse character', 'Walk to street art', 'Small pool', 'Quiet at night'], familyFit: 'Twin family rooms with character — good for older kids who appreciate heritage charm.', link: 'https://www.booking.com' },
    { city: 'penang', cityName: 'Penang', name: 'Citadines Connect George Town', type: 'mid', price: 55, location: 'George Town', pros: ['Apartment-style flexibility', 'Roof pool with city views', 'Walk to Komtar', 'Self check-in kiosk'], familyFit: 'Studio for 4 with kitchenette — easy family base for 3 nights.', link: 'https://www.discoverasr.com' },
    { city: 'penang', cityName: 'Penang', name: '88 Armenian Street', type: 'luxury', price: 180, location: 'Armenian Street', pros: ['Boutique heritage building', 'Right on the street art trail', 'Personalised service', 'Beautiful design'], familyFit: 'Suites built for couples or small families of 3 — book early, it sells out.', link: 'https://88armenian.com' },

    // Langkawi
    { city: 'langkawi', cityName: 'Langkawi', name: 'Royal Agate Beach Resort', type: 'budget', price: 32, location: 'Pantai Cenang', pros: ['Direct beach access', 'Family rooms', 'Pool with kids zone', 'Good restaurants nearby'], familyFit: 'Best-value beachfront for the family — rooms sleep 4 with extra bed.', link: 'https://www.booking.com' },
    { city: 'langkawi', cityName: 'Langkawi', name: 'Pelangi Beach Resort & Spa', type: 'mid', price: 120, location: 'Pantai Cenang', pros: ['Sprawling beach resort', 'Multiple pools', 'Tropical garden setting', 'Kids club'], familyFit: 'Garden chalets sleep families nicely — kids club lets parents grab a quiet dinner.', link: 'https://pelangibeachresort.com' },
    { city: 'langkawi', cityName: 'Langkawi', name: 'Temple Tree Resort', type: 'mid', price: 152, location: 'Pantai Cenang', pros: ['Restored heritage houses', 'Sister to Bon Ton', 'Free bikes & kayaks', 'Animal sanctuary on-site'], familyFit: 'Whole-house bookings = the family in one private heritage building. Magical.', link: 'https://templetreelangkawi.com' },
    { city: 'langkawi', cityName: 'Langkawi', name: 'The Westin Langkawi', type: 'luxury', price: 220, location: 'Burau Bay', pros: ['Beachfront luxury', 'Six restaurants', 'Westin Kids Club', 'Dolphin pool views'], familyFit: 'Family rooms with daybeds plus a serious kids programme — parents get their spa day.', link: 'https://www.marriott.com' },
    { city: 'langkawi', cityName: 'Langkawi', name: 'Four Seasons Resort Langkawi', type: 'luxury', price: 385, location: 'Tanjung Rhu', pros: ['Ultra-luxury beachfront', 'Private pavilions', 'World-class kids for all seasons', 'Mangrove tours from resort'], familyFit: 'Splurge tier — the kids club is legendary, mangrove tours leave from the property.', link: 'https://www.fourseasons.com' }
  ],

  transfers: [
    { from: 'kl', to: 'penang', date: 'Thu · May 28', mode: 'Flight', detail: 'AirAsia / Firefly · KLIA2 → Penang Intl · ~1h · ~RM 80' },
    { from: 'penang', to: 'langkawi', date: 'Sun · May 31', mode: 'Ferry or Flight', detail: 'Swettenham Pier ferry · 2.5h · RM 70 — or AirAsia flight 30 min' }
  ]
};
