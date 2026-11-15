<?php
/**
 * Extract every Modula gallery into a JSON document.
 *
 * Modula stores galleries as `modula-gallery` posts whose `modula-images` meta is
 * a PHP-serialized array of attachment references. PHP is the only honest way to
 * unserialize that, so this runs inside the WordPress container via `wp eval-file`.
 *
 * Output: { id, slug, title, images: [{ id, alt, caption, file, width, height }] }
 * where `file` is relative to wp-content/uploads, which is the path we copy from.
 */

$upload = wp_upload_dir();
$base   = trailingslashit($upload['basedir']);

$galleries = get_posts([
    'post_type'   => 'modula-gallery',
    'numberposts' => -1,
    'post_status' => 'any',
]);

$out = [];

foreach ($galleries as $gallery) {
    $raw    = get_post_meta($gallery->ID, 'modula-images', true);
    $images = [];

    if (is_array($raw)) {
        foreach ($raw as $item) {
            $id = isset($item['id']) ? (int) $item['id'] : 0;
            if (! $id) {
                continue;
            }

            $abs  = get_attached_file($id);
            $meta = wp_get_attachment_metadata($id);

            if (! $abs || ! file_exists($abs)) {
                continue;
            }

            $images[] = [
                'id'      => $id,
                'alt'     => isset($item['alt']) && $item['alt'] !== ''
                    ? $item['alt']
                    : (string) get_post_meta($id, '_wp_attachment_image_alt', true),
                'caption' => isset($item['title']) ? (string) $item['title'] : '',
                'file'    => ltrim(str_replace($base, '', $abs), '/'),
                'width'   => isset($meta['width']) ? (int) $meta['width'] : null,
                'height'  => isset($meta['height']) ? (int) $meta['height'] : null,
            ];
        }
    }

    $out[] = [
        'id'     => $gallery->ID,
        'slug'   => $gallery->post_name,
        'title'  => $gallery->post_title,
        'images' => $images,
    ];
}

echo json_encode($out, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), "\n";
