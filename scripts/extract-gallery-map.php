<?php
/**
 * Map each page to the Modula galleries its content embeds.
 *
 * The rendered HTML loses the shortcode, so the page → gallery relationship has
 * to be read from post_content. Output drives the galleries collection and the
 * page/gallery split of the migration.
 */

$pages = get_posts([
    'post_type'   => 'page',
    'numberposts' => -1,
    'post_status' => 'publish',
]);

$out = [];

foreach ($pages as $page) {
    if (! preg_match_all('/\[modula[^\]]*?id=[\'"]?(\d+)[\'"]?/i', $page->post_content, $matches)) {
        continue;
    }

    $galleryIds = array_values(array_unique(array_map('intval', $matches[1])));
    $slugs      = [];

    foreach ($galleryIds as $galleryId) {
        $gallery = get_post($galleryId);
        $slugs[] = $gallery ? $gallery->post_name : null;
    }

    $out[] = [
        'pageSlug'   => $page->post_name,
        'pageId'     => $page->ID,
        'pageTitle'  => $page->post_title,
        'galleryIds' => $galleryIds,
        'gallerySlugs' => $slugs,
    ];
}

echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), "\n";
