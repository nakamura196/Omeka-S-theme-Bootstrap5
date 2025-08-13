# Bootstrap5 Modernized Theme for Omeka S

A modern, responsive theme for Omeka S built with Bootstrap 5, featuring enhanced search capabilities, improved user interface, and mobile-first design.

## Features

### 🎨 Modern Design
- **Bootstrap 5** integration with responsive grid system
- **Mobile-first** approach with responsive breakpoints
- **Clean typography** and consistent visual hierarchy
- **Card-based layouts** for improved content organization

### 🔍 Enhanced Search Interface
- **Advanced search form** with Bootstrap 5 styling
- **Grid/List view toggle** with localStorage persistence
- **Improved pagination** with compact controls
- **Faceted search** with collapsible filter panels
- **Search results** with modern card and list layouts

### 📱 Responsive Components
- **Navigation bar** with Bootstrap 5 navbar
- **Hero carousel** for homepage banners
- **Modular header/footer** components
- **Breadcrumb navigation** with Bootstrap styling

### 📄 Item Display Improvements
- **Enhanced item details** with sidebar layout
- **Metadata presentation** with Bootstrap cards
- **Media attachments** with thumbnails and download links
- **Resource links** with appropriate icons and styling

### 🎛️ Theme Customization
- **Color picker** for accent colors
- **Logo upload** support
- **Banner configuration** with positioning options
- **Footer content** customization
- **Hero carousel** configuration for multiple slides

## Installation

1. Copy the theme to your Omeka S themes directory:
   ```
   /themes/bootstrap5/
   ```

2. Activate the theme in your Omeka S admin panel:
   - Go to **Sites** → **[Your Site]** → **Theme**
   - Select "Bootstrap5 Modernized"
   - Configure theme settings as needed

## Technical Implementation

### File Structure
```
themes/bootstrap5/
├── asset/
│   ├── css/
│   │   └── search-view-toggle.css     # Grid/List toggle functionality
│   └── js/
│       └── search-view-toggle.js      # View switching logic
├── config/
│   └── theme.ini                      # Theme configuration
├── view/
│   ├── layout/
│   │   └── layout.phtml              # Main layout template
│   ├── common/
│   │   ├── header.phtml              # Bootstrap navbar
│   │   ├── footer.phtml              # Footer component
│   │   ├── hero.phtml                # Hero carousel
│   │   ├── breadcrumbs.phtml         # Breadcrumb navigation
│   │   ├── search-form.phtml         # Search form component
│   │   ├── pagination.phtml          # Bootstrap pagination
│   │   ├── form-row.phtml            # Form styling
│   │   ├── resource-values.phtml     # Metadata display
│   │   └── search-filters-links.phtml # Filter badges
│   ├── search/
│   │   ├── search.phtml              # Search results page
│   │   ├── results.phtml             # Results grid/list layouts
│   │   ├── results-header-footer.phtml # Search controls
│   │   ├── search-form-main.phtml    # Advanced search form
│   │   ├── sort-selector.phtml       # Sort dropdown
│   │   ├── pagination-per-page-selector.phtml # Items per page
│   │   ├── facets-list.phtml         # Faceted search filters
│   │   ├── facet-checkboxes.phtml    # Checkbox facets
│   │   └── facet-actives.phtml       # Active filter badges
│   └── omeka/site/item/
│       └── show.phtml                # Item detail page
└── README.md                         # This file
```

### Key Technologies
- **Bootstrap 5.3.3** - CSS framework and components
- **Font Awesome 6** - Icons and visual elements
- **JavaScript ES6** - Modern browser features
- **CSS Custom Properties** - Bootstrap variable system
- **Responsive Design** - Mobile-first approach

### Browser Support
- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- iOS Safari 14+
- Android Chrome 88+

## Customization

### Theme Settings
Configure the theme through Omeka S admin panel:

1. **Accent Color**: Primary brand color for links and buttons
2. **Logo**: Upload your organization's logo
3. **Banner**: Homepage hero image
4. **Navigation Depth**: Control menu hierarchy levels
5. **Footer Content**: Custom HTML content for footer
6. **Hero Slides**: Configure carousel titles and descriptions

### CSS Customization
The theme uses Bootstrap 5 CSS custom properties for easy customization:

```css
:root {
  --bs-primary: #your-color;
  --bs-secondary: #your-secondary-color;
}
```

### Advanced Customization
- Override template files by copying to your theme
- Modify CSS variables for color schemes
- Extend JavaScript functionality for custom interactions

## Features in Detail

### Search Interface
- **Grid View**: Card-based layout with large thumbnails
- **List View**: Compact horizontal layout
- **View Persistence**: User preference saved in localStorage
- **Responsive**: Automatic layout adjustment for mobile devices

### Pagination
- **Compact Design**: Page input with navigation buttons
- **Bootstrap Styled**: Consistent with framework design
- **Accessible**: Proper ARIA labels and keyboard navigation

### Faceted Search
- **Bootstrap Cards**: Organized filter groups
- **Collapsible Sections**: Space-efficient interface
- **Active Filter Badges**: Clear indication of applied filters
- **Responsive**: Mobile-friendly accordion layout

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across different browsers and devices
5. Submit a pull request

## License

This theme is released under the same license as Omeka S.

## Support

For issues and feature requests, please use the GitHub issue tracker.

---

**Version**: 2.0.0  
**Omeka S Compatibility**: 4.1.0+  
**Last Updated**: 2024