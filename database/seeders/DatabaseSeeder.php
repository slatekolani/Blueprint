<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\Project;
use App\Models\Service;
use App\Models\SiteSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Parent Group ──────────────────────────────────────────────────────────
        $groupHeroImage = Company::where('slug', 'blueprint-group')->value('hero_image_path') ?: '/images/blueprint/printing-showcase.jpeg';
        $group = Company::updateOrCreate(['slug' => 'blueprint-group'], [
            'name'             => 'BluePrint Group',
            'short_name'       => 'BluePrint',
            'tagline'          => 'Ideas designed. Brands built. Business moved forward.',
            'summary'          => 'A Tanzanian group delivering design, branding, printing, marketing, supply, logistics, insurance, ICT and event solutions.',
            'description'      => 'BluePrint is a Tanzanian-based creative and business solutions group established to meet the growing demand for quality brand, supply and professional services in Tanzania and beyond. We combine creativity, practical execution and dependable customer care across our family of specialist companies.',
            'hero_image_path'  => $groupHeroImage,
            'primary_color'    => '#073B7A',
            'accent_color'     => '#20A8E0',
            'email'            => 'info@blueprintgroup.co.tz',
            'phone'            => '+255 754 444 010',
            'website'          => 'blueprintgroup.co.tz',
            'address'          => 'Mbezi Beach, Tangi Bovu, Dar es Salaam',
            'instagram'        => '@blueprinttanzania',
            'is_parent'        => true,
            'sort_order'       => 0,
            'meta_title'       => 'BluePrint Group Tanzania',
            'meta_description' => 'Creative, printing, logistics, supply and insurance solutions from BluePrint Group Tanzania.',
        ]);

        // ─── Member Companies ──────────────────────────────────────────────────────
        $companies = [
            [
                'name'            => 'Lonewolf Company Ltd',
                'slug'            => 'lonewolf-company',
                'short_name'      => 'Lonewolf',
                'tagline'         => 'Print with purpose. Finish with impact.',
                'summary'         => 'Commercial printing and branded production services for organizations, campaigns and events.',
                'description'     => 'Lonewolf Company Ltd supports businesses with dependable print production, branded merchandise and visual communication materials prepared to professional standards.',
                'primary_color'   => '#161B33',
                'accent_color'    => '#F4A024',
                'email'           => 'info@blueprintgroup.co.tz',
                'phone'           => '+255 754 444 010',
                'address'         => 'Mbezi Beach, Tangi Bovu, Dar es Salaam',
                'hero_image_path' => '/images/blueprint/services-poster.jpeg',
                'sort_order'      => 1,
            ],
            [
                'name'            => 'Access Worldwide Logistics',
                'slug'            => 'access-logistics',
                'short_name'      => 'Access Logistics',
                'tagline'         => 'We carry. We care. We deliver.',
                'summary'         => 'Dependable sourcing, supply and delivery solutions for businesses, institutions and individuals.',
                'description'     => 'Access Worldwide Logistics provides quality-assured products, competitive sourcing, timely delivery and tailored supply solutions. Our work connects customers to trusted building materials, PPE, uniforms, promotional materials, car accessories and spare parts.',
                'primary_color'   => '#075B70',
                'accent_color'    => '#F58220',
                'email'           => 'access.logistics@blueprintgroup.co.tz',
                'phone'           => '+255 718 122 236',
                'address'         => 'Mbezi Beach, Tangi Bovu, Dar es Salaam',
                'instagram'       => 'accessworldwidelogistics',
                'hero_image_path' => '/images/blueprint/access-logistics.jpeg',
                'sort_order'      => 2,
            ],
            [
                'name'            => 'Wisevision',
                'slug'            => 'wisevision',
                'short_name'      => 'Wisevision',
                'tagline'         => 'Creative vision made visible.',
                'summary'         => 'Design-led printing, visual branding and promotional production for modern businesses.',
                'description'     => 'Wisevision transforms business ideas into clear, attractive and memorable visual materials through creative design, print and brand production services.',
                'primary_color'   => '#563A9C',
                'accent_color'    => '#37B7C3',
                'email'           => 'info@blueprintgroup.co.tz',
                'phone'           => '+255 754 444 010',
                'address'         => 'Mbezi Beach, Tangi Bovu, Dar es Salaam',
                'hero_image_path' => '/images/blueprint/printing-offer.jpeg',
                'sort_order'      => 3,
            ],
            [
                'name'            => 'Blue Access Insurance Agency',
                'slug'            => 'blue-access-insurance',
                'short_name'      => 'Blue Access',
                'tagline'         => 'Fast. Reliable. Affordable.',
                'summary'         => 'Insurance guidance and cover for people, property, vehicles, travel, agriculture and business assets.',
                'description'     => 'Blue Access Insurance Agency helps individuals and organizations choose appropriate insurance protection with responsive support and clear guidance from inquiry through cover.',
                'primary_color'   => '#063B7A',
                'accent_color'    => '#2E75C5',
                'email'           => 'info@blueaccessinsurance.co.tz',
                'phone'           => '+255 718 122 236',
                'website'         => 'blueaccessinsurance.co.tz',
                'address'         => 'Mbezi Beach, Tangi Bovu, Dar es Salaam',
                'hero_image_path' => '/images/blueprint/blue-access.jpeg',
                'sort_order'      => 4,
            ],
        ];

        $companyModels = [];
        foreach ($companies as $company) {
            $company['hero_image_path'] = Company::where('slug', $company['slug'])->value('hero_image_path') ?: $company['hero_image_path'];
            $companyModels[$company['slug']] = Company::updateOrCreate(
                ['slug' => $company['slug']],
                [...$company, 'parent_id' => $group->id]
            );
        }

        // ─── Services (full descriptions) ─────────────────────────────────────────
        $services = [

            'blueprint-group' => [
                [
                    'name'       => 'Graphic Design',
                    'category'   => 'Creative',
                    'summary'    => 'Creative design for campaigns, brands and business communication.',
                    'image_path' => '/images/blueprint/printing-offer.jpeg',
                    'is_featured' => true,
                    'description' => "BluePrint Group's graphic design service covers the full range of visual communication needs for modern businesses and organizations. Our design team works closely with clients to understand their brand identity, target audience and communication goals before producing any artwork.\n\nWe design for print and digital — from logos and brand guidelines to campaign materials, packaging, presentations, social media content and event branding. Every piece is prepared to production-ready standards with attention to typography, color consistency and layout precision.\n\nWhether you are launching a new brand, refreshing existing materials or running a time-sensitive campaign, our team delivers quality creative work on schedule. We serve organizations across sectors including hospitality, retail, government, NGOs, construction and financial services.",
                ],
                [
                    'name'       => 'Web Development & Hosting',
                    'category'   => 'Digital',
                    'summary'    => 'Responsive websites, web applications and dependable hosting.',
                    'image_path' => '/images/blueprint/printing-showcase.jpeg',
                    'is_featured' => true,
                    'description' => "A strong online presence starts with a well-built website. BluePrint Group designs and develops responsive websites and web applications that are fast, secure and easy to manage — tailored to each client's specific purpose and audience.\n\nOur development process covers everything from initial planning and design to coding, testing and deployment. We build on reliable technology stacks and follow modern standards to ensure your website performs well across all devices and screen sizes.\n\nOnce your site is live, we provide dependable hosting with uptime monitoring, regular backups and support. We also maintain existing sites, add new features and carry out updates as your business needs grow.",
                ],
                [
                    'name'       => 'Large Format Printing',
                    'category'   => 'Printing',
                    'summary'    => 'Banners, displays, signage, vehicle branding and outdoor print.',
                    'image_path' => '/images/blueprint/services-poster.jpeg',
                    'is_featured' => false,
                    'description' => "Our large format printing service produces high-impact visual materials designed to command attention at any scale. From exhibition displays and indoor banners to outdoor billboards, building wraps and vehicle graphics, we handle print work that needs to look great and last in demanding environments.\n\nWe use professional-grade equipment and durable media — vinyl, canvas, mesh, backlit film and rigid substrates — to match the right material to each application. Colors are calibrated and printed at resolutions that remain crisp and vibrant whether viewed up close or from a distance.\n\nDelivery, installation support and finishing options including lamination, grommets and mounting frames are available. We serve event organizers, retailers, construction companies, NGOs and government institutions throughout Tanzania.",
                ],
                [
                    'name'       => 'Digital, Offset & Screen Printing',
                    'category'   => 'Printing',
                    'summary'    => 'Professional production for stationery, publications, clothing and promotions.',
                    'image_path' => '/images/blueprint/printing-showcase.jpeg',
                    'is_featured' => false,
                    'description' => "We offer three core printing technologies under one roof so clients can choose the method best suited to their job. Digital printing is ideal for short-run, personalized or quick-turnaround work — business cards, flyers, booklets and customized materials produced with sharp detail and consistent color.\n\nOffset printing delivers the most cost-effective quality for longer print runs — catalogs, magazines, corporate reports, packaging and stationery where consistency across large quantities is critical. Our offset presses handle both single-color and full CMYK work on a wide range of paper stocks.\n\nScreen printing is the preferred choice for branded clothing, bags, promotional items and materials where ink needs to bond directly to fabric or specialty surfaces. We print on t-shirts, polo shirts, tote bags, caps, uniforms and marketing materials to clients' exact brand specifications.",
                ],
                [
                    'name'       => 'Marketing & Merchandising',
                    'category'   => 'Marketing',
                    'summary'    => 'Practical marketing, media planning and branded merchandise solutions.',
                    'image_path' => '/images/blueprint/printing-offer.jpeg',
                    'is_featured' => false,
                    'description' => "Effective marketing is about more than creative work — it requires a clear plan, the right channels and materials that connect with your audience. BluePrint Group supports clients with practical marketing services covering campaign strategy, media placement, print and digital content production and branded merchandise.\n\nOur merchandising service helps businesses strengthen brand recognition through everyday customer touchpoints. We supply and brand pens, notebooks, mugs, bags, caps, lanyards, USB drives and other items that keep your name visible long after the first interaction.\n\nWhether you are planning a product launch, a community outreach campaign, an exhibition presence or an employee recognition program, we can develop the materials and strategy to support it.",
                ],
                [
                    'name'       => 'ICT Equipment Supply',
                    'category'   => 'ICT',
                    'summary'    => 'Supply of computers, accessories and business technology equipment.',
                    'image_path' => '/images/blueprint/services-poster.jpeg',
                    'is_featured' => false,
                    'description' => "BluePrint Group sources and supplies a broad range of ICT equipment for business, institutional and educational environments. We work with trusted distributors to provide computers, laptops, printers, projectors, networking equipment, uninterruptible power supplies, storage devices and peripherals.\n\nWe handle procurement on behalf of clients, manage vendor communication and ensure equipment is delivered in full and on time. For larger orders, we offer competitive pricing through our supplier relationships and can provide product demonstrations before purchase.\n\nBasic setup, installation support and warranty coordination are included in our supply service. We have supplied ICT equipment to schools, NGOs, private businesses, government departments and financial institutions across Tanzania.",
                ],
                [
                    'name'       => 'Clothing & Uniforms',
                    'category'   => 'Apparel',
                    'summary'    => 'Branded uniforms, corporate wear and custom clothing production.',
                    'image_path' => '/images/blueprint/printing-showcase.jpeg',
                    'is_featured' => false,
                    'description' => "A well-dressed team communicates professionalism before a word is spoken. BluePrint Group designs, produces and supplies branded clothing including staff uniforms, corporate shirts, branded t-shirts, caps, overalls, safety wear and promotional apparel for events and campaigns.\n\nWe work with clients to select the right fabrics, cuts and colors for their environment — whether it is a hotel front-of-house team, a construction site crew, a retail sales force or a corporate office. Branding is applied through embroidery, screen printing or heat transfer depending on the garment and design requirements.\n\nMinimum order quantities are flexible for most items. We serve single-company orders as well as large institutional contracts requiring consistent supply across multiple locations and departments.",
                ],
                [
                    'name'       => 'Event Management',
                    'category'   => 'Events',
                    'summary'    => 'Planning, branding and execution support for corporate and public events.',
                    'image_path' => '/images/blueprint/services-poster.jpeg',
                    'is_featured' => false,
                    'description' => "Running a successful event takes detailed planning, clear communication and reliable execution across many moving parts. BluePrint Group provides event management support covering concept development, venue coordination, branding and decoration, supplier management, logistics and on-the-day execution.\n\nOur event branding service ensures your event looks consistent and professional — from entrance signage and stage backdrops to branded programs, table materials, merchandise and digital screens. We have supported conferences, product launches, award ceremonies, community outreach programs and trade exhibitions.\n\nWe can manage full events on behalf of clients or provide specific support such as print materials, branded décor or logistics coordination for events being managed internally.",
                ],
                [
                    'name'       => 'General Supplies',
                    'category'   => 'Supply',
                    'summary'    => 'Reliable sourcing and supply of operational business requirements.',
                    'image_path' => '/images/blueprint/access-logistics.jpeg',
                    'is_featured' => false,
                    'description' => "Businesses of all sizes need a reliable supply partner for the everyday items that keep operations running. BluePrint Group sources and delivers a broad range of general supplies including office consumables, cleaning products, safety materials, packaging supplies, kitchen and canteen items, and operational goods.\n\nWe handle procurement on behalf of clients — identifying the right suppliers, confirming availability, negotiating pricing and managing delivery to your location. Regular supply arrangements can be structured on a monthly, quarterly or project-by-project basis depending on what suits your business.\n\nOur general supply service is used by hotels, schools, hospitals, construction companies, NGOs and private businesses across Tanzania who prefer to consolidate their purchasing through a single dependable supplier.",
                ],
            ],

            'lonewolf-company' => [
                [
                    'name'       => 'Commercial Printing',
                    'category'   => 'Printing',
                    'summary'    => 'High-quality print production for organizations and campaigns.',
                    'image_path' => '/images/blueprint/printing-showcase.jpeg',
                    'is_featured' => true,
                    'description' => "Lonewolf Company Ltd delivers professional commercial printing for businesses, institutions and campaign teams that need reliable quality and consistent results. We handle both short and long print runs across a wide variety of print products — from flyers, brochures and booklets to posters, catalogs, reports and branded stationery.\n\nOur printing process begins with proper file preparation and proofing. We check every job for color accuracy, bleed, resolution and alignment before production starts, so what you receive matches what was agreed. Paper stock options include coated, uncoated, recycled and specialty finishes in a full range of weights.\n\nFinishing options are available in-house: trimming, folding, binding, lamination (matte, gloss and soft-touch), spot UV coating, embossing and hole punching. Most jobs are delivered within 2–5 working days depending on quantity and complexity.",
                ],
                [
                    'name'       => 'Branded Merchandise',
                    'category'   => 'Branding',
                    'summary'    => 'Custom promotional products carrying your organization identity.',
                    'image_path' => '/images/blueprint/printing-offer.jpeg',
                    'is_featured' => true,
                    'description' => "Promotional merchandise keeps your brand in front of customers and staff long after any event or campaign ends. Lonewolf produces a wide range of branded items including pens, notebooks, mugs, water bottles, bags, caps, keychains, lanyards, USB drives, phone holders and desk accessories — all printed or engraved with your brand.\n\nWe help clients select products that suit their audience and budget, then manage production from artwork approval through to delivery. Items are checked for print quality and branding accuracy before dispatch, and we can arrange bulk packaging and labelling for distribution at events or in gift packs.\n\nBranded merchandise orders are available from small quantities for specific events through to large-scale procurement for national distribution. Lead times and pricing are confirmed at order stage.",
                ],
                [
                    'name'       => 'Corporate Stationery',
                    'category'   => 'Printing',
                    'summary'    => 'Business cards, letterheads, envelopes, folders and office materials.',
                    'image_path' => '/images/blueprint/services-poster.jpeg',
                    'is_featured' => false,
                    'description' => "Professional stationery communicates brand credibility in every piece of correspondence and business interaction. Lonewolf designs and prints a full range of corporate stationery for new businesses and established organizations alike — business cards, company letterheads, compliment slips, branded envelopes, presentation folders and ID cards.\n\nBusiness cards are produced on premium stocks with options including matte, gloss and soft-touch lamination, rounded corners, spot UV highlights and double-sided full-color printing. Letterheads and envelopes are prepared to match brand guidelines precisely, with consistent color matching across the stationery suite.\n\nWe can handle one-time orders for new brand launches as well as ongoing supply arrangements where stationery is reprinted as existing stock runs low. Digital artwork files are stored on file so reorders are straightforward.",
                ],
                [
                    'name'       => 'Outdoor Branding',
                    'category'   => 'Branding',
                    'summary'    => 'Banners, flags, signage and display materials for visibility.',
                    'image_path' => '/images/blueprint/printing-showcase.jpeg',
                    'is_featured' => false,
                    'description' => "Outdoor branding materials give organizations visibility where it matters — in the street, at the venue, around the site or along the road. Lonewolf produces a full range of outdoor print and display materials built to withstand sun, wind, rain and heavy use.\n\nOur outdoor branding range includes PVC banners, mesh banners, X-banners, teardrop and feather flags, pop-up displays, A-frame boards, building wraps, site hoardings, directional signage and branded tents. Materials are printed using UV-stable inks on substrates selected for durability in outdoor conditions.\n\nInstallation accessories including stands, poles, ropes and grommets are supplied with most products. We serve events, construction sites, retail outlets, schools, NGOs and political campaigns. Rush production is available for urgent outdoor branding requirements.",
                ],
            ],

            'access-logistics' => [
                [
                    'name'       => 'Building Materials Supply',
                    'category'   => 'Supply',
                    'summary'    => 'Hardware and building materials sourced and delivered reliably.',
                    'image_path' => '/images/blueprint/access-logistics.jpeg',
                    'is_featured' => true,
                    'description' => "Access Worldwide Logistics sources and delivers building materials and hardware to construction projects, contractors, developers and individual builders across Tanzania. We supply cement, steel rods, roofing materials, pipes, electrical fittings, tiles, paint, timber, and general hardware — from local manufacturers and quality international suppliers.\n\nOur procurement team evaluates supplier pricing and quality on every order to ensure customers receive competitive rates without compromising on specifications. We can supply small quantities for individual projects as well as bulk orders for large construction sites with phased delivery schedules.\n\nDelivery is coordinated to site, with load management and unloading support available. We also handle procurement for customers in areas where local availability is limited, sourcing from Dar es Salaam and other major supply hubs.",
                ],
                [
                    'name'       => 'PPE Supplies',
                    'category'   => 'Supply',
                    'summary'    => 'Protective equipment for construction, industry and institutional teams.',
                    'image_path' => '/images/blueprint/services-poster.jpeg',
                    'is_featured' => true,
                    'description' => "Personal protective equipment is a legal and ethical requirement on any serious work site, and Access Worldwide Logistics ensures your teams are properly equipped. We supply a comprehensive range of PPE including hard hats, safety boots, high-visibility vests, gloves, face masks, safety goggles, ear protection, overalls and full-body protective suits.\n\nOur PPE stock meets international safety standards and is suitable for construction, manufacturing, mining, agriculture, laboratory, medical and institutional environments. We work with procurement teams to understand the hazard profile of each workplace and recommend appropriate protective solutions.\n\nBulk PPE orders for large organizations or project sites can be fulfilled with consistent sizing, color coding by team or role, and branding with company logos where required. Replenishment orders can be set up on a regular supply schedule.",
                ],
                [
                    'name'       => 'Marketing Materials Supply',
                    'category'   => 'Supply',
                    'summary'    => 'Sourcing and delivery of branded marketing and campaign materials.',
                    'image_path' => '/images/blueprint/printing-offer.jpeg',
                    'is_featured' => false,
                    'description' => "Access Worldwide Logistics handles the logistics of getting marketing materials — branded or unbranded — from production point to destination. Whether your materials are being printed by our group partners or sourced from external suppliers, we manage the supply chain from collection through to last-mile delivery.\n\nThis service is used by advertising agencies, corporate marketing teams and event organizers who need reliable distribution of flyers, banners, merchandise, branded packaging and point-of-sale materials to multiple locations across Tanzania.\n\nWe can store materials at our facility between campaign phases and dispatch on instruction, giving marketing teams flexibility over timing without worrying about storage or transport. Delivery tracking and confirmation reports are provided for large distribution operations.",
                ],
                [
                    'name'       => 'Uniforms Supply & Tailoring',
                    'category'   => 'Apparel',
                    'summary'    => 'Workwear and uniforms supplied and tailored to requirements.',
                    'image_path' => '/images/blueprint/printing-showcase.jpeg',
                    'is_featured' => false,
                    'description' => "A consistent, well-presented uniform communicates professionalism and reinforces brand identity across every customer-facing and operational role. Access Worldwide Logistics supplies readymade and custom-tailored uniforms for companies across the hospitality, retail, healthcare, construction, security and education sectors.\n\nFor bespoke uniform requirements, we work with clients to select fabric type, color, cut and design, then coordinate tailoring to produce garments that meet the specific demands of the work environment — whether that means heat resistance, durability, formal appearance or freedom of movement.\n\nWe can supply uniforms in full staff sizes from a single order, with consistent color matching and finishing across the entire batch. Reorder arrangements are available as staff numbers change or replacement items are needed throughout the year.",
                ],
                [
                    'name'       => 'Car Accessories & Spare Parts',
                    'category'   => 'Automotive',
                    'summary'    => 'Reliable sourcing of vehicle accessories and replacement parts.',
                    'image_path' => '/images/blueprint/access-logistics.jpeg',
                    'is_featured' => false,
                    'description' => "Keeping vehicles on the road depends on timely access to the right parts at the right price. Access Worldwide Logistics sources genuine and quality-equivalent spare parts and accessories for passenger vehicles, commercial trucks, agricultural machinery and construction equipment.\n\nWe supply filters, brake components, engine parts, electrical parts, batteries, tyres, body panels, lights and interior accessories for a wide range of makes and models. Parts are sourced from verified distributors and importers to ensure quality and fitment compatibility.\n\nThis service is used by fleet operators, transport companies, construction contractors, individual vehicle owners and workshops who need a reliable supply partner for both routine maintenance parts and urgent replacement items. We can handle one-off sourcing requests or set up regular supply arrangements for fleet maintenance programs.",
                ],
            ],

            'wisevision' => [
                [
                    'name'       => 'Creative Design',
                    'category'   => 'Creative',
                    'summary'    => 'Clear, engaging graphic concepts for print and brand communication.',
                    'image_path' => '/images/blueprint/printing-offer.jpeg',
                    'is_featured' => true,
                    'description' => "Wisevision's creative design team translates your brand story into compelling visuals that connect with your audience. We work across a full range of design disciplines — brand identity, campaign graphics, print layouts, digital content, social media visuals, presentations and packaging — to give your business a consistent, professional appearance.\n\nEvery design project starts with a brief and a clear understanding of the client's objectives, audience and existing brand guidelines. Our designers bring ideas to life through structured concept development, present options for feedback and refine the work until it achieves the desired communication goals.\n\nWe are experienced working with small businesses building their first visual identity and with established organizations refreshing their brand or managing high-volume creative production. Fast turnaround options are available for urgent campaign requirements.",
                ],
                [
                    'name'       => 'Digital Printing',
                    'category'   => 'Printing',
                    'summary'    => 'Fast production for short-run and personalized printed materials.',
                    'image_path' => '/images/blueprint/printing-showcase.jpeg',
                    'is_featured' => true,
                    'description' => "Digital printing is the smart choice for print jobs where speed, flexibility and short run quantities matter. Wisevision's digital printing service produces sharp, vibrant results on flyers, brochures, business cards, booklets, certificates, menus, invitations and marketing inserts with no minimum order requirement and fast turnaround times.\n\nBecause digital printing requires no printing plates, it is also cost-effective for personalized printing — variable data applications where each piece carries a different name, code, address or image. This makes it ideal for event tickets, membership cards, personalized mailers and targeted campaign materials.\n\nWe print on a wide selection of paper stocks, weights and finishes. Same-day and next-day production options are available for urgent jobs. Files can be submitted digitally, and our team checks every job for print-readiness before going to press.",
                ],
                [
                    'name'       => 'Promotional Displays',
                    'category'   => 'Branding',
                    'summary'    => 'Roll-up banners, flags, tents, stands and event display products.',
                    'image_path' => '/images/blueprint/services-poster.jpeg',
                    'is_featured' => false,
                    'description' => "Stand out at any event, exhibition or sales point with professionally produced promotional display materials from Wisevision. We design and produce a complete range of display products — roll-up banners, X-banners, pop-up displays, branded tents, teardrop and feather flags, table covers, hanging banners and backdrop systems.\n\nAll display materials are printed with vibrant colors that remain consistent under event lighting conditions. We use durable substrates and hardware that withstand repeated assembly and disassembly without losing print quality or structural integrity — important for materials used across multiple events.\n\nDisplay materials come complete with carry bags and assembly hardware. We can produce standard sizes for cost efficiency or custom dimensions to fit your specific space. Design, printing and assembly in one place keeps the process simple and delivery timely.",
                ],
                [
                    'name'       => 'Custom Merchandise',
                    'category'   => 'Branding',
                    'summary'    => 'Branded mugs, caps, shirts, bags and customer gifts.',
                    'image_path' => '/images/blueprint/printing-offer.jpeg',
                    'is_featured' => false,
                    'description' => "Wisevision helps businesses and organizations create branded merchandise that people actually use — reinforcing brand visibility every time the item is picked up, worn or displayed. Our merchandise range includes printed and embroidered t-shirts, polo shirts, caps, hoodies, tote bags, backpacks, mugs, water bottles, phone accessories, notebooks and packaging gifts.\n\nWe advise on product selection based on your audience, occasion and budget, then manage the branding application — whether screen print, embroidery, heat transfer or direct print — to achieve the best possible result on each item.\n\nMerchandise orders are available from small quantities for intimate events through to large bulk orders for staff programs, product launches or national campaigns. Lead times and minimum quantities are confirmed per product at inquiry stage.",
                ],
            ],

            'blue-access-insurance' => [
                [
                    'name'       => 'Life Insurance',
                    'category'   => 'Personal',
                    'summary'    => 'Protection designed to support families and long-term financial security.',
                    'image_path' => '/images/blueprint/insurance-team.jpeg',
                    'is_featured' => true,
                    'description' => "Life insurance is one of the most important financial decisions a person can make — and Blue Access Insurance Agency helps individuals and families choose the right cover with confidence. We represent trusted underwriters and guide clients through policy options covering term life, whole life, group life and investment-linked plans.\n\nOur advisors take time to understand each client's family situation, income level, outstanding liabilities and future goals before recommending appropriate coverage. We explain policy terms in plain language so clients understand what they are committing to, what is covered and how claims are processed.\n\nOnce a policy is in place, Blue Access continues to support clients with annual reviews, beneficiary updates and claims assistance. We ensure families are never left navigating the insurance process alone when they need it most.",
                ],
                [
                    'name'       => 'Agriculture & Livestock Insurance',
                    'category'   => 'Agriculture',
                    'summary'    => 'Cover for agricultural operations, crops and livestock risks.',
                    'image_path' => '/images/blueprint/insurance-services.jpeg',
                    'is_featured' => true,
                    'description' => "Tanzania's agricultural sector faces real risks from drought, flooding, pest damage, disease and market volatility. Blue Access Insurance Agency provides specialized agricultural insurance solutions that help farmers, cooperatives, agribusinesses and rural entrepreneurs protect their livelihoods against unexpected losses.\n\nOur agricultural insurance products cover crop failure from adverse weather and disease, livestock mortality and injury, storage facility damage, farm equipment and infrastructure. We work with insurance underwriters who understand the specific challenges of Tanzanian agriculture and design policies that reflect local conditions.\n\nPolicies can be tailored to small-scale subsistence farmers, medium commercial operations and large agribusinesses. We also support clients seeking group cover through farmer cooperatives and agricultural associations. Claims support is responsive and handled by people familiar with agricultural operations.",
                ],
                [
                    'name'       => 'Motor Vehicle Insurance',
                    'category'   => 'Motor',
                    'summary'    => 'Flexible vehicle cover for individuals and commercial fleets.',
                    'image_path' => '/images/blueprint/motor-insurance.jpeg',
                    'is_featured' => false,
                    'description' => "Motor insurance is a legal requirement in Tanzania for every vehicle on the road — but the level of protection you choose determines how well you are covered when an accident, theft or damage occurs. Blue Access Insurance Agency guides private vehicle owners, business fleet managers and public transport operators to policies that genuinely protect them.\n\nWe offer comprehensive, third-party fire and theft, and third-party only motor vehicle covers through our network of underwriters. Comprehensive cover includes own damage, theft, third-party liability, medical expenses and roadside assistance depending on the policy selected.\n\nFleet insurance arrangements are available for businesses operating multiple vehicles, with consolidated policy management and competitive group rates. We handle the full process from quotation through to registration and sticker issuance, and support clients through claims to ensure fair and timely settlement.",
                ],
                [
                    'name'       => 'Property Insurance',
                    'category'   => 'Property',
                    'summary'    => 'Protection for homes, offices, buildings and valuable property.',
                    'image_path' => '/images/blueprint/blue-access.jpeg',
                    'is_featured' => false,
                    'description' => "Whether you own a family home, a rental property, a business premises or a commercial building, property insurance gives you a financial safety net against fire, theft, structural damage, natural disasters and liability claims from third parties on your premises.\n\nBlue Access Insurance Agency assesses each property individually to recommend the appropriate level of cover based on building value, contents, location risk and use. We work with underwriters offering both standard property covers and specialist policies for commercial complexes, warehouses, factories and high-value residential properties.\n\nProperty cover can be arranged as a standalone policy or bundled with business interruption cover for commercial properties — protecting not just the physical asset but also the income lost when operations are disrupted by an insured event.",
                ],
                [
                    'name'       => 'Travel Insurance',
                    'category'   => 'Travel',
                    'summary'    => 'Cover and assistance for domestic and international travel.',
                    'image_path' => '/images/blueprint/insurance-services.jpeg',
                    'is_featured' => false,
                    'description' => "Travel insurance protects individuals and business travelers against the costs and disruptions that can arise before or during a trip — from flight cancellations and lost luggage to medical emergencies abroad and personal liability. Blue Access provides travel insurance for single trips, annual multi-trip policies and group travel arrangements.\n\nOur travel policies cover emergency medical treatment and evacuation, trip cancellation and curtailment, lost or delayed baggage, travel delays, passport and document loss, and personal accident. For business travelers, we can arrange cover that includes business equipment protection and liability extensions.\n\nCover is available for travel within Tanzania and internationally. Policies are issued quickly — in most cases the same day as inquiry — and documentation is provided in digital format for immediate use. Our team is available to assist with emergency contact information and claims support during the trip.",
                ],
                [
                    'name'       => 'Plant & Machinery Insurance',
                    'category'   => 'Business',
                    'summary'    => 'Cover for operational equipment, plant and machinery assets.',
                    'image_path' => '/images/blueprint/insurance-team.jpeg',
                    'is_featured' => false,
                    'description' => "Heavy equipment and industrial machinery represent significant capital investment — and when a machine breaks down or is damaged, the cost to the business goes beyond repair bills to include lost production time, contract penalties and workforce downtime. Blue Access Insurance Agency provides specialist plant and machinery cover designed for these risks.\n\nOur plant insurance products cover breakdown, accidental damage, fire, theft and malicious damage for construction equipment, manufacturing machinery, agricultural plant, generators, compressors, cranes, earth-moving equipment and other operational assets.\n\nPolicies are structured around the declared value and age of each item, with options for all-risk cover or specific named-peril policies depending on the nature of the risk environment. We can also arrange contractors' all-risk policies for construction companies and installation businesses requiring comprehensive site cover.",
                ],
                [
                    'name'       => 'Marine Insurance',
                    'category'   => 'Marine',
                    'summary'    => 'Protection for goods, cargo and marine-related transit risks.',
                    'image_path' => '/images/blueprint/blue-access.jpeg',
                    'is_featured' => false,
                    'description' => "Marine insurance covers the risk of loss, damage or delay to goods and cargo in transit — whether by sea, road, rail or air. For importers, exporters and trading businesses operating in Tanzania's active trade environment, this protection is essential for managing supply chain risk.\n\nBlue Access Insurance Agency arranges marine cargo insurance on a per-shipment or open-cover basis for regular shippers. We work with underwriters whose policies cover all types of goods including general cargo, equipment, perishables, vehicles and project cargo.\n\nCoverage options include all-risk, named perils and restricted cover depending on the nature of the goods and the risk appetite of the client. We assist with claims documentation and liaise with surveyors and underwriters to support a smooth settlement process in the event of loss or damage.",
                ],
            ],
        ];

        $allCompanies = ['blueprint-group' => $group, ...$companyModels];
        foreach ($services as $companySlug => $items) {
            foreach ($items as $index => $svc) {
                $serviceKeys = ['company_id' => $allCompanies[$companySlug]->id, 'slug' => Str::slug($svc['name'])];
                $svc['image_path'] = Service::where($serviceKeys)->value('image_path') ?: $svc['image_path'];
                $service = Service::updateOrCreate(
                    $serviceKeys,
                    [
                        'name'        => $svc['name'],
                        'category'    => $svc['category'],
                        'summary'     => $svc['summary'],
                        'description' => $svc['description'],
                        'image_path'  => $svc['image_path'],
                        'is_featured' => $svc['is_featured'],
                        'sort_order'  => $index,
                    ]
                );
                $service->servicePrice()->updateOrCreate([], [
                    'price' => $svc['price'] ?? 'Price on request',
                ]);
            }
        }

        // ─── Projects (full descriptions) ─────────────────────────────────────────
        $projects = [

            // BluePrint Group
            [
                'company'          => $group,
                'title'            => 'Corporate Print & Promotion — Tanzania Education Authority',
                'slug'             => 'tea-corporate-print-promotion',
                'category'         => 'Printing',
                'client'           => 'Tanzania Education Authority',
                'location'         => 'Dar es Salaam, Tanzania',
                'completed_at'     => '2024-11-30',
                'cover_image_path' => '/images/blueprint/printing-showcase.jpeg',
                'summary'          => 'A full suite of branded stationery, event materials and promotional items produced for a national education body.',
                'is_featured'      => true,
                'description'      => "The Tanzania Education Authority required a comprehensive set of branded materials ahead of their annual national conference — one of the largest gatherings in the Tanzanian education sector, bringing together school administrators, government officials and education partners from across the country.\n\nBluePrint Group managed the entire production process from artwork creation through to delivery. The scope included 2,000 branded folders with document inserts, 1,500 notebooks with embossed covers, 1,200 branded pens, 800 conference lanyards and ID cards, 300 roll-up banners for venue branding, stage backdrop prints and directional signage across three conference halls.\n\nAll items were delivered three days ahead of the event date, allowing the client's team time for setup and quality review. The color consistency across print and merchandise was specifically noted by the client in their post-event feedback. BluePrint Group continues to serve as their preferred print and promotions supplier.",
            ],
            [
                'company'          => $group,
                'title'            => 'Event Branding — BluePrint Group Annual Brand Showcase',
                'slug'             => 'blueprint-annual-brand-showcase',
                'category'         => 'Events',
                'client'           => 'BluePrint Group (Internal)',
                'location'         => 'Dar es Salaam, Tanzania',
                'completed_at'     => '2025-03-15',
                'cover_image_path' => '/images/blueprint/services-poster.jpeg',
                'summary'          => 'Full event branding, merchandise and display production for an internal group showcase event.',
                'is_featured'      => true,
                'description'      => "BluePrint Group's annual brand showcase brings together its member companies, clients and partners to celebrate the group's work, introduce new services and strengthen relationships. The event required a consistent visual identity that united all sub-brands under the BluePrint umbrella while giving each company its own presence.\n\nThe production scope included a main stage backdrop spanning 8 meters, company-specific display pods with individual branded roll-ups and printed materials, a welcome entrance installation, branded tablecloths and name cards for a seated dinner, 500 delegate bags with merchandise, and a printed program booklet.\n\nThe showcase was attended by over 300 guests and generated significant interest in the group's expanded service offering. The event was cited by multiple attendees as one of the most professionally branded events they had attended in Dar es Salaam that year.",
            ],

            // Lonewolf
            [
                'company'          => $companyModels['lonewolf-company'],
                'title'            => 'Annual Report Print — Karibu Investment Group',
                'slug'             => 'karibu-investment-annual-report',
                'category'         => 'Printing',
                'client'           => 'Karibu Investment Group',
                'location'         => 'Dar es Salaam, Tanzania',
                'completed_at'     => '2024-09-20',
                'cover_image_path' => '/images/blueprint/printing-showcase.jpeg',
                'summary'          => 'Design and print production of a 68-page full-color annual report for a Tanzanian investment company.',
                'is_featured'      => true,
                'description'      => "Karibu Investment Group required a high-quality printed annual report that would represent the organization professionally to shareholders, regulatory bodies and institutional partners. The report needed to convey financial seriousness while being visually engaging and easy to navigate.\n\nLonewolf Company Ltd handled the full production process — from design layout through to final delivery. The 68-page report was laid out in a two-column format with custom infographics, financial table design, photography integration and full bilingual (English/Swahili) typesetting. The cover used a 350gsm board with soft-touch matte lamination and a spot UV treatment on the logo.\n\nThe interior pages were printed on 130gsm silk-coated paper with stitch-bound finishing. A print run of 500 copies was completed and delivered to the client's office in Dar es Salaam within the agreed seven-day production window. The client ordered an additional 200 copies two weeks after delivery.",
            ],
            [
                'company'          => $companyModels['lonewolf-company'],
                'title'            => 'Outdoor Branding Campaign — Serengeti Festival 2025',
                'slug'             => 'serengeti-festival-outdoor-branding',
                'category'         => 'Branding',
                'client'           => 'Serengeti Festival Organizing Committee',
                'location'         => 'Arusha, Tanzania',
                'completed_at'     => '2025-01-18',
                'cover_image_path' => '/images/blueprint/services-poster.jpeg',
                'summary'          => 'Large-scale outdoor branding and display production for a major cultural festival in Arusha.',
                'is_featured'      => true,
                'description'      => "The Serengeti Festival organizing committee approached Lonewolf Company Ltd to handle all outdoor branding production for their three-day cultural and music festival, one of the most attended events in northern Tanzania.\n\nThe production scope included 14 large PVC banners (3m × 6m) for perimeter and entrance points, 60 branded feather flags distributed across venue zones, a 12-meter main stage backdrop, 4 branded event tents for sponsor and vendor areas, and over 200 directional signage pieces for parking, toilets, food courts and emergency exits.\n\nAll materials were printed with UV-stable inks and weather-treated for outdoor durability. Production was completed in 9 days from artwork approval, with delivery and installation support provided on-site in Arusha ahead of the opening day. Zero production issues were reported during the event.",
            ],

            // Access Logistics
            [
                'company'          => $companyModels['access-logistics'],
                'title'            => 'Building Materials Delivery — Bahari City Development',
                'slug'             => 'bahari-city-building-materials',
                'category'         => 'Supply',
                'client'           => 'Bahari City Development Ltd',
                'location'         => 'Dar es Salaam, Tanzania',
                'completed_at'     => '2024-12-05',
                'cover_image_path' => '/images/blueprint/access-logistics.jpeg',
                'summary'          => 'Phased supply and site delivery of building materials for a large residential development project.',
                'is_featured'      => true,
                'description'      => "Bahari City Development Ltd engaged Access Worldwide Logistics to manage the supply and phased delivery of building materials for a 40-unit residential development project in Dar es Salaam. The scale of the project required reliable supply across a six-month construction program, with materials arriving on a schedule aligned to the construction sequence.\n\nAccess Logistics coordinated procurement of cement (over 1,800 bags across five deliveries), steel rods (22 tonnes), roofing sheets, plumbing materials, electrical conduit and fittings, and finish materials including tiles and paint. All items were sourced from quality-assured local manufacturers and importers, with pricing held firm for the duration of the supply agreement.\n\nOn-time delivery was maintained across all five supply phases, and no construction delays were attributed to materials shortfall. The client has since engaged Access Logistics for their second development project, citing supply reliability and competitive pricing as the deciding factors.",
            ],
            [
                'company'          => $companyModels['access-logistics'],
                'title'            => 'PPE Supply — Mchuchuma Coal Mine Expansion',
                'slug'             => 'mchuchuma-ppe-supply',
                'category'         => 'Supply',
                'client'           => 'Mchuchuma Coal Project (Contractor)',
                'location'         => 'Njombe Region, Tanzania',
                'completed_at'     => '2025-02-28',
                'cover_image_path' => '/images/blueprint/services-poster.jpeg',
                'summary'          => 'Bulk PPE procurement and delivery for a mine expansion project employing over 300 workers.',
                'is_featured'      => false,
                'description'      => "A construction contractor working on the Mchuchuma coal mine expansion required a complete PPE package for a workforce of over 300 workers across multiple hazard zones. The contract required all items to meet international safety certifications and be delivered to site in Njombe Region within 14 days of order confirmation.\n\nAccess Worldwide Logistics procured and delivered 350 hard hats in four role-specific colors, 300 pairs of safety boots in a full size range, 350 high-visibility vests, 300 pairs of heavy-duty gloves, 200 safety goggles, 150 pairs of ear protection and 100 full-body disposable coveralls for hazardous area operations.\n\nAll items were verified against the client's PPE specification list before dispatch, packed in labeled kits by size and role, and transported to site with full delivery documentation. The 14-day delivery commitment was met with two days to spare. The client placed a follow-on order for replacement items within 60 days.",
            ],

            // Wisevision
            [
                'company'          => $companyModels['wisevision'],
                'title'            => 'Brand Identity & Print Launch — Zara Cosmetics Tanzania',
                'slug'             => 'zara-cosmetics-brand-launch',
                'category'         => 'Creative',
                'client'           => 'Zara Cosmetics Tanzania',
                'location'         => 'Dar es Salaam, Tanzania',
                'completed_at'     => '2024-08-12',
                'cover_image_path' => '/images/blueprint/printing-offer.jpeg',
                'summary'          => 'Complete brand identity design and launch print production for a new Tanzanian cosmetics brand.',
                'is_featured'      => true,
                'description'      => "Zara Cosmetics Tanzania launched as a new brand in the Tanzanian personal care market and required a complete visual identity built from scratch — one that would position the brand as modern, aspirational and locally relevant.\n\nWisevision developed the full brand identity starting with logo design, presenting three distinct concepts before refining the chosen direction. The final identity included a logo system, color palette, typography hierarchy, product label templates, shopping bag design, social media templates and a brand usage guide.\n\nThe brand launch print package included 5,000 shopping bags in two sizes, 10,000 product labels across six SKUs, 2,000 branded tissue sheets, 1,000 loyalty cards, 200 point-of-sale shelf talkers and 50 store display roll-ups. All items were delivered to the client's distribution warehouse in time for the retail launch event. The brand was featured in a Tanzanian lifestyle publication within its first month of launch.",
            ],
            [
                'company'          => $companyModels['wisevision'],
                'title'            => 'Conference Display Package — East Africa HR Summit',
                'slug'             => 'east-africa-hr-summit-displays',
                'category'         => 'Branding',
                'client'           => 'East Africa HR Network',
                'location'         => 'Nairobi, Kenya (delivered from Dar es Salaam)',
                'completed_at'     => '2024-10-05',
                'cover_image_path' => '/images/blueprint/services-poster.jpeg',
                'summary'          => 'Full exhibition display package produced for a regional HR conference attended by delegates from six countries.',
                'is_featured'      => false,
                'description'      => "The East Africa HR Network required a professional exhibition display package for their annual summit, which was hosted in Nairobi and attended by HR professionals and executives from Tanzania, Kenya, Uganda, Rwanda, Ethiopia and Zambia.\n\nWisevision designed and produced a complete conference display set: a 5-panel pop-up display system with a custom graphic skin, 4 branded roll-up banners for breakout session rooms, 2 hanging banner sets for the main hall, branded table runners and covers, 500 delegate tote bags with insert printing, and a branded podium cover.\n\nAll materials were designed in English and structured for high-impact visual communication in a multi-national audience context. The pop-up system and roll-ups were packed in carry cases and transported to Nairobi via cargo. The network's executive director described the materials as 'the most professional display the summit has had in five years.'",
            ],

            // Blue Access Insurance
            [
                'company'          => $companyModels['blue-access-insurance'],
                'title'            => 'Fleet Motor Insurance — Simba Transport Services',
                'slug'             => 'simba-transport-fleet-insurance',
                'category'         => 'Motor',
                'client'           => 'Simba Transport Services Ltd',
                'location'         => 'Dar es Salaam, Tanzania',
                'completed_at'     => '2024-07-01',
                'cover_image_path' => '/images/blueprint/motor-insurance.jpeg',
                'summary'          => 'Comprehensive fleet motor insurance arranged for a 28-vehicle commercial transport company.',
                'is_featured'      => true,
                'description'      => "Simba Transport Services Ltd operates a fleet of 28 commercial vehicles across multiple routes in Tanzania. Their previous insurance arrangement involved three separate brokers managing different vehicles, leading to inconsistent cover levels, administrative complexity and poor claims response.\n\nBlue Access Insurance Agency conducted a full fleet audit and restructured the client's motor insurance under a single consolidated comprehensive fleet policy with one renewal date. The policy covers all 28 vehicles for own damage, third-party liability, fire, theft and medical expenses, with a dedicated claims contact number and 24-hour emergency breakdown notification service.\n\nSince consolidating with Blue Access, the client has processed two claims — both settled within 21 days. Annual premium cost was reduced by 12% compared to the previous multi-broker arrangement, and the client's fleet manager now manages all vehicle insurance through a single point of contact.",
            ],
            [
                'company'          => $companyModels['blue-access-insurance'],
                'title'            => 'Agricultural Cover — Kilosa Farmers Cooperative',
                'slug'             => 'kilosa-farmers-cooperative-ag-cover',
                'category'         => 'Agriculture',
                'client'           => 'Kilosa Farmers Cooperative Society',
                'location'         => 'Kilosa District, Morogoro Region',
                'completed_at'     => '2024-04-30',
                'cover_image_path' => '/images/blueprint/insurance-services.jpeg',
                'summary'          => 'Group agricultural insurance arranged for 120 smallholder farmers covering crops and livestock.',
                'is_featured'      => false,
                'description'      => "The Kilosa Farmers Cooperative Society sought insurance protection for their 120 member smallholder farmers, most of whom had never held insurance cover and were exposed to serious financial risk from crop failure, drought and livestock disease.\n\nBlue Access Insurance Agency worked with the cooperative leadership over three months to design a group agricultural policy appropriate for the farming profile of the membership — predominantly maize and sunflower cultivation, with a significant proportion also keeping cattle and goats.\n\nThe policy arranged covers crop failure due to drought, flood and pest infestation, livestock mortality from disease and accident, and limited farm equipment cover for hand-held tools and small machinery. Premium contributions were structured as an affordable per-member annual amount collected by the cooperative. Within the first eight months, three crop damage claims and one livestock mortality claim were processed, with all settlements received within the agreed claim period. The experience significantly strengthened trust in agricultural insurance among cooperative members.",
            ],
        ];

        foreach ($projects as $index => $p) {
            $projectKeys = ['company_id' => $p['company']->id, 'slug' => $p['slug']];
            $p['cover_image_path'] = Project::where($projectKeys)->value('cover_image_path') ?: $p['cover_image_path'];
            Project::updateOrCreate(
                $projectKeys,
                [
                    'title'            => $p['title'],
                    'category'         => $p['category'],
                    'summary'          => $p['summary'],
                    'description'      => $p['description'],
                    'client'           => $p['client'],
                    'location'         => $p['location'],
                    'completed_at'     => $p['completed_at'],
                    'cover_image_path' => $p['cover_image_path'],
                    'is_featured'      => $p['is_featured'],
                    'sort_order'       => $index,
                ]
            );
        }

        // ─── Site Settings ─────────────────────────────────────────────────────────
        $settings = [
            ['site_name',         'BluePrint Group',                                                                                    'text',     'general', 'Site name'],
            ['hero_eyebrow',      'Tanzania-based. Multi-sector. Built to deliver.',                                                     'text',     'home',    'Hero eyebrow'],
            ['hero_title',        'One group. Specialized solutions.',                                                                   'text',     'home',    'Hero title'],
            ['hero_description',  'Creative, supply, logistics and insurance expertise working together to move your business forward.', 'textarea', 'home',    'Hero description'],
            ['about_title',       'Practical expertise under one trusted group',                                                         'text',     'home',    'About title'],
            ['about_description', 'BluePrint brings focused companies together so customers can access dependable creative, operational and protection services through one relationship.', 'textarea', 'home', 'About description'],
            ['contact_email',     'info@blueprintgroup.co.tz',                                                                          'email',    'contact', 'Contact email'],
            ['contact_phone',     '+255 754 444 010',                                                                                   'text',     'contact', 'Contact phone'],
            ['contact_address',   'Mbezi Beach, Tangi Bovu, Dar es Salaam',                                                             'text',     'contact', 'Address'],
            ['years_experience',  '8+',                                                                                                 'text',     'stats',   'Years of experience'],
            ['service_categories','20+',                                                                                                'text',     'stats',   'Service categories'],
            ['group_companies',   '5',                                                                                                  'text',     'stats',   'Group companies'],
        ];

        foreach ($settings as [$key, $value, $type, $section, $label]) {
            SiteSetting::updateOrCreate(['key' => $key], compact('value', 'type', 'label') + ['group' => $section]);
        }

        // ─── Admin User ────────────────────────────────────────────────────────────
        User::updateOrCreate(['email' => 'admin@blueprintgroup.co.tz'], [
            'name'              => 'BluePrint Administrator',
            'password'          => Hash::make('Blueprint@2026'),
            'role'              => 'super_admin',
            'is_active'         => true,
            'email_verified_at' => now(),
        ]);
    }
}
