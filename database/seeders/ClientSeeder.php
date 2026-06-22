<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $clients = [
            [
                'name'        => 'Government of Tanzania',
                'description' => 'Supplied branded promotional materials, large-format prints, and ceremonial signage for various government events and public campaigns across Tanzania.',
                'sort_order'  => 1,
            ],
            [
                'name'        => 'National Food Reserve Agency (NFRA)',
                'description' => 'Designed and produced branded uniforms, office stationery, and large-format banners used in NFRA awareness campaigns and official functions.',
                'sort_order'  => 2,
            ],
            [
                'name'        => 'DAWASA — Dar es Salaam Water Supply & Sanitation Authority',
                'description' => 'Delivered branded workwear, safety vests, promotional roll-up banners, and event display materials for DAWASA public outreach programmes.',
                'sort_order'  => 3,
            ],
            [
                'name'        => 'Wizara ya Maji (Ministry of Water)',
                'description' => 'Produced branded long-sleeve uniforms, embroidered polo shirts, promotional bags, and teardrop flags used in the Ministry\'s national water campaigns.',
                'sort_order'  => 4,
            ],
            [
                'name'        => 'Halmashauri ya Wilaya ya Pangani',
                'description' => 'Supplied branded promotional materials including teardrop flags, banners, and branded bags for the Wekeza Pangani district investment promotion initiative.',
                'sort_order'  => 5,
            ],
            [
                'name'        => 'RUWASA — Rural Water Supply and Sanitation Agency',
                'description' => 'Printed and supplied large-format display banners, branded stationery, and promotional items supporting RUWASA\'s rural water access awareness campaigns.',
                'sort_order'  => 6,
            ],
            [
                'name'        => 'Mzumbe University',
                'description' => 'Provided branded institutional uniforms, graduation event signage, large-format prints, and promotional materials for university events and open days.',
                'sort_order'  => 7,
            ],
            [
                'name'        => 'TUGHE — Tanzania Union of Government & Health Employees',
                'description' => 'Designed and printed branded membership materials, banners, branded uniforms, and event displays for TUGHE union activities and annual conferences.',
                'sort_order'  => 8,
            ],
            [
                'name'        => 'Tanzania Investment Centre (TIC)',
                'description' => 'Produced exhibition displays, branded brochures, pull-up banners, and promotional merchandise for TIC investment forums and international trade expos.',
                'sort_order'  => 9,
            ],
            [
                'name'        => 'University of Dodoma (UDOM)',
                'description' => 'Supplied branded institutional print materials, event signage, large-format banners, and promotional items for university open days and academic ceremonies.',
                'sort_order'  => 10,
            ],
            [
                'name'        => 'NMB Bank',
                'description' => 'Delivered comprehensive branch branding materials, promotional banners, branded stationery, staff uniforms, and point-of-sale display items for NMB Bank branches nationwide.',
                'sort_order'  => 11,
            ],
            [
                'name'        => 'CRDB Bank',
                'description' => 'Designed and produced branded promotional bags, tote bags, corporate gifts, branded uniforms, and large-format display materials for CRDB Bank campaigns and events.',
                'sort_order'  => 12,
            ],
            [
                'name'        => 'Bakhresa Group (BG)',
                'description' => 'Supplied branded promotional tents, promo stands, uniforms, teardrop flags, and large-format prints for Bakhresa Group product activation events and AZAM brand campaigns.',
                'sort_order'  => 13,
            ],
            [
                'name'        => 'Wami/Ruvu Basin Water Board (WRBWB)',
                'description' => 'Produced branded workwear, safety uniforms, official stationery, and large-format awareness banners for WRBWB water conservation and public education programmes.',
                'sort_order'  => 14,
            ],
            [
                'name'        => 'Posta Tanzania',
                'description' => 'Provided branded staff uniforms, office signage, promotional banners, and print materials for Posta Tanzania branches and customer-facing service campaigns.',
                'sort_order'  => 15,
            ],
            [
                'name'        => 'VETA — Vocational Education and Training Authority',
                'description' => 'Designed and printed branded promotional materials, student uniforms, event banners, and institutional signage for VETA training centres and national skills exhibitions.',
                'sort_order'  => 16,
            ],
            [
                'name'        => 'Tanzania Petroleum Corporation (TPC)',
                'description' => 'Supplied branded corporate uniforms, safety workwear, executive stationery, and large-format signage for TPC corporate events and field operations.',
                'sort_order'  => 17,
            ],
            [
                'name'        => 'Exness',
                'description' => 'Produced high-quality branded promotional merchandise, exhibition display materials, corporate gifts, and roll-up banners for Exness Tanzania market activations.',
                'sort_order'  => 18,
            ],
            [
                'name'        => 'Interchick — Kuku Mfalme',
                'description' => 'Delivered branded promotional items, branded caps, embroidered uniforms, product display banners, and marketing print materials for Interchick\'s Kuku Mfalme brand.',
                'sort_order'  => 19,
            ],
            [
                'name'        => 'Ifakara Health Institute (IHI)',
                'description' => 'Supplied branded researcher uniforms, research event banners, branded stationery, and promotional materials for IHI field programmes and health research campaigns.',
                'sort_order'  => 20,
            ],
            [
                'name'        => 'NHIF — National Health Insurance Fund',
                'description' => 'Produced branded promotional materials, awareness banners, staff uniforms, branded bags, and large-format displays for NHIF public enrolment and outreach campaigns.',
                'sort_order'  => 21,
            ],
            [
                'name'        => 'Canada High Commission Tanzania',
                'description' => 'Designed and printed branded event materials, roll-up banners, promotional items, and display signage for Canada High Commission official programmes and public events in Tanzania.',
                'sort_order'  => 22,
            ],
            [
                'name'        => 'Embassy of the Kingdom of the Netherlands',
                'description' => 'Produced branded roll-up banners, event branding, promotional materials, and display items for NL Embassy development programmes including gender equality and empowerment campaigns.',
                'sort_order'  => 23,
            ],
            [
                'name'        => 'TCAA — Tanzania Civil Aviation Authority',
                'description' => 'Supplied branded institutional uniforms, safety workwear, official signage, corporate stationery, and event display materials for TCAA regulatory and public engagement activities.',
                'sort_order'  => 24,
            ],
            [
                'name'        => 'TEMESA — Tanzania Electrical, Mechanical and Electronics Services Agency',
                'description' => 'Provided branded workwear, vehicle branding, promotional banners, and official stationery for TEMESA service operations and public-facing agency programmes.',
                'sort_order'  => 25,
            ],
            [
                'name'        => 'Parliament of Tanzania — Bunge la Tanzania',
                'description' => 'Delivered high-quality branded print materials, ceremonial signage, branded stationery, and promotional items for Parliament of Tanzania official sessions and public outreach.',
                'sort_order'  => 26,
            ],
            [
                'name'        => 'SIDO — Small Industries Development Organisation',
                'description' => 'Produced branded promotional materials, exhibition displays, branded stationery, and event signage for SIDO entrepreneurship programmes and small business development expos.',
                'sort_order'  => 27,
            ],
            [
                'name'        => 'Magu District Council',
                'description' => 'Supplied branded district promotional materials, large-format banners, official stationery, and uniforms for Magu District Council community programmes and official functions.',
                'sort_order'  => 28,
            ],
            [
                'name'        => 'COPRA — Cashew and Other Produce Regulatory Authority',
                'description' => 'Designed and produced branded uniforms, promotional banners, awareness materials, and branded stationery for COPRA regulatory activities and farmer outreach programmes.',
                'sort_order'  => 29,
            ],
            [
                'name'        => 'TADB — Tanzania Agricultural Development Bank',
                'description' => 'Delivered branded corporate materials, staff uniforms, promotional banners, branded gifts, and large-format prints for TADB farmer engagement programmes and branch operations.',
                'sort_order'  => 30,
            ],
        ];

        foreach ($clients as $client) {
            Client::create(array_merge($client, ['is_published' => true]));
        }

        $this->command->info('Seeded ' . count($clients) . ' clients.');
    }
}
