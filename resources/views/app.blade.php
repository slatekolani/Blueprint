@php
    $meta        = $page['props']['meta'] ?? [];
    $title       = $meta['title'] ?? 'BluePrint Group Tanzania';
    $description = $meta['description'] ?? 'A Tanzanian business group delivering creative design, printing, supply, logistics, insurance and ICT solutions.';
    $ogImage     = $meta['image'] ?? url('/favicon-og.png');
    $ogType      = $meta['ogType'] ?? 'website';
    $canonical   = url()->current();
    $schemaData  = $meta['structuredData'] ?? null;
    $breadcrumbs = $meta['breadcrumbs'] ?? null;
@endphp
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1">

        <title inertia>{{ $title }}</title>

        {{-- Primary meta --}}
        <meta name="description" content="{{ $description }}">
        <meta name="author" content="BluePrint Group Tanzania">
        <meta name="theme-color" content="#073B7A">

        {{-- Geographic meta (GEO) --}}
        <meta name="geo.region" content="TZ-02">
        <meta name="geo.placename" content="Dar es Salaam, Tanzania">
        <meta name="geo.position" content="-6.7924;39.2083">
        <meta name="ICBM" content="-6.7924, 39.2083">

        {{-- Open Graph / Facebook --}}
        <meta property="og:site_name" content="BluePrint Group">
        <meta property="og:type" content="{{ $ogType }}">
        <meta property="og:url" content="{{ $canonical }}">
        <meta property="og:title" content="{{ $title }}">
        <meta property="og:description" content="{{ $description }}">
        <meta property="og:image" content="{{ $ogImage }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:locale" content="en_TZ">

        {{-- Twitter / X Card --}}
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:site" content="@blueprinttanzania">
        <meta name="twitter:creator" content="@blueprinttanzania">
        <meta name="twitter:title" content="{{ $title }}">
        <meta name="twitter:description" content="{{ $description }}">
        <meta name="twitter:image" content="{{ $ogImage }}">

        {{-- Canonical URL --}}
        <link rel="canonical" href="{{ $canonical }}">

        {{-- Organization JSON-LD (global — present on every page for GEO) --}}
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "{{ url('/') }}#organization",
            "name": "BluePrint Group",
            "alternateName": "BluePrint Group Tanzania",
            "url": "{{ url('/') }}",
            "logo": {
                "@type": "ImageObject",
                "url": "{{ url('/favicon-512x512.png') }}",
                "width": 512,
                "height": 512
            },
            "description": "A Tanzanian multi-sector business group delivering design, branding, printing, supply, logistics, insurance and ICT solutions.",
            "address": {
                "@type": "PostalAddress",
                "streetAddress": "Mbezi Beach, Tangi Bovu",
                "addressLocality": "Dar es Salaam",
                "addressRegion": "Dar es Salaam",
                "addressCountry": "TZ"
            },
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+255-754-444-010",
                "email": "info@blueprintgroup.co.tz",
                "contactType": "customer service",
                "availableLanguage": ["English", "Swahili"]
            },
            "areaServed": {
                "@type": "Country",
                "name": "Tanzania"
            },
            "sameAs": [
                "https://www.instagram.com/blueprinttanzania",
                "https://x.com/blueprinttanzania",
                "https://wa.me/255754444010"
            ]
        }
        </script>

        {{-- Per-page structured data --}}
        @if ($schemaData)
        <script type="application/ld+json">
        {!! json_encode($schemaData, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
        </script>
        @endif

        {{-- BreadcrumbList structured data --}}
        @if ($breadcrumbs && count($breadcrumbs) > 1)
        <script type="application/ld+json">
        {!! json_encode([
            '@context'        => 'https://schema.org',
            '@type'           => 'BreadcrumbList',
            'itemListElement' => collect($breadcrumbs)->values()->map(fn($crumb, $i) => [
                '@type'    => 'ListItem',
                'position' => $i + 1,
                'name'     => $crumb['label'],
                'item'     => isset($crumb['href']) ? url($crumb['href']) : url()->current(),
            ])->all(),
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT) !!}
        </script>
        @endif

        <!-- Favicons -->
        <link rel="icon" type="image/x-icon"     href="/favicon.ico">
        <link rel="icon" type="image/png" sizes="16x16"  href="/favicon-16x16.png">
        <link rel="icon" type="image/png" sizes="32x32"  href="/favicon-32x32.png">
        <link rel="icon" type="image/png" sizes="96x96"  href="/favicon-96x96.png">
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
        <meta name="msapplication-TileImage" content="/favicon-192x192.png">
        <meta name="msapplication-TileColor" content="#073B7A">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/Pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
