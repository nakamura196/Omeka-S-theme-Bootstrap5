<?php
namespace DevIiifViewers;

use Laminas\EventManager\Event;
use Laminas\EventManager\SharedEventManagerInterface;
use Omeka\Module\AbstractModule;

/**
 * Test environment only (scripts/dev/setup.zsh links it in). The real modules IiifViewers and
 * IiifServer are heavy to install, so this prints the viewer the same way IiifViewers does
 * (on view.show.before, through common/helper/iiif-viewers), pointing at production's
 * Mirador and manifest. Settings copy what production shows (2026-09-25).
 */
class Module extends AbstractModule
{
    const LIVE = 'https://app.toyobunko-lab.jp';

    public function getConfig()
    {
        return [];
    }

    public function attachListeners(SharedEventManagerInterface $sharedEventManager): void
    {
        $sharedEventManager->attach('Omeka\Controller\Site\Item', 'view.show.before', [$this, 'renderViewer']);
    }

    public function renderViewer(Event $event): void
    {
        $view = $event->getTarget();
        $item = $view->item;
        $identifier = $item->value('dcterms:identifier');
        if (!$identifier || !count($item->media())) {
            return;
        }
        echo $view->partial('common/helper/iiif-viewers', ['config' => [
            'asset' => self::LIVE . '/modules/IiifViewers/asset/',
            'iiifResourceUri' => self::LIVE . '/iiif/2/' . rawurlencode((string) $identifier) . '/manifest',
            'setting' => [
                'viewer_value' => 'mirador',
                'viewer_lang' => 'ja',
                'manifest_icon' => null,
                'url_1' => self::LIVE . '/modules/IiifViewers/asset/vendor/mirador/index.html?manifest=',
                'label_1' => 'Mirador',
                'url_2' => 'http://universalviewer.io/examples/uv/uv.html#?manifest=',
                'label_2' => 'Universal Viewer',
                'viewer_help' => self::LIVE . '/assets/TBMR_show_contents_index.pdf',
                'viewer_help_text' => '使い方',
            ],
        ]]);
    }
}
