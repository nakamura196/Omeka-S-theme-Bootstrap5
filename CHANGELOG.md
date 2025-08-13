# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2024-12-19

### 🎉 Major Release - Complete Bootstrap 5 Modernization

#### ✨ Added
- **Bootstrap 5.3.3** integration with full responsive design system
- **Grid/List view toggle** for search results with localStorage persistence
- **Enhanced search interface** with modern Bootstrap components
- **Responsive navigation bar** with Bootstrap 5 navbar component
- **Hero carousel** for homepage with configurable slides
- **Modular components**: separate header, footer, breadcrumbs, and search form partials
- **Advanced pagination** with compact page input and navigation buttons
- **Faceted search improvements** with Bootstrap card layouts and collapsible sections
- **Enhanced item detail pages** with sidebar layout and improved metadata presentation
- **Multi-language support** with proper translation helpers throughout

#### 🔧 Technical Improvements
- **Form styling** with Bootstrap 5 form components and validation states
- **CSS custom properties** integration with Bootstrap variable system
- **JavaScript modules** for view toggle functionality with smooth transitions
- **Responsive breakpoints** optimized for mobile-first design
- **Font Awesome 6** integration for consistent iconography
- **Search form enhancements** with proper Bootstrap styling and layout

#### 🎨 UI/UX Enhancements
- **Card-based layouts** for better content organization
- **Improved typography** with Bootstrap's type scale
- **Consistent spacing** using Bootstrap utility classes
- **Better color contrast** and accessibility improvements
- **Smooth animations** for view transitions and interactions
- **Mobile-optimized** navigation and search interface

#### 🛠️ Template Overrides
- `layout/layout.phtml` - Main layout with Bootstrap 5 structure
- `common/header.phtml` - Bootstrap navbar with responsive design
- `common/footer.phtml` - Simplified footer with theme settings
- `common/hero.phtml` - Bootstrap carousel for homepage
- `common/breadcrumbs.phtml` - Bootstrap breadcrumb navigation
- `common/search-form.phtml` - Bootstrap form components
- `common/pagination.phtml` - Compact pagination with page input
- `common/form-row.phtml` - Bootstrap horizontal form layout
- `common/resource-values.phtml` - Enhanced metadata display with cards
- `common/search-filters-links.phtml` - Filter badges with Bootstrap styling
- `search/search.phtml` - Two-column layout with facets sidebar
- `search/results.phtml` - Grid/list layouts with responsive design
- `search/results-header-footer.phtml` - Search controls with Bootstrap components
- `search/search-form-main.phtml` - Advanced search with Bootstrap styling
- `search/sort-selector.phtml` - Bootstrap select component
- `search/pagination-per-page-selector.phtml` - Items per page selector
- `search/facets-list.phtml` - Collapsible facet cards
- `search/facet-checkboxes.phtml` - Bootstrap checkbox styling
- `search/facet-actives.phtml` - Active filter badges
- `omeka/site/item/show.phtml` - Enhanced item detail page with sidebar

#### 📱 Responsive Features
- **Mobile-first design** with Bootstrap 5 breakpoints
- **Flexible grid system** adapting to screen sizes
- **Touch-friendly** navigation and form controls
- **Optimized typography** for readability across devices

#### ⚡ Performance Improvements
- **Efficient CSS** using Bootstrap's utility-first approach
- **Minimal JavaScript** with modern ES6 features
- **Optimized images** with responsive loading
- **Local storage** for user preferences persistence

#### 🔧 Configuration Options
- **Accent color picker** for brand customization
- **Logo upload** support with navbar integration
- **Banner configuration** with positioning options
- **Navigation depth** control for menu hierarchy
- **Footer content** customization with HTML support
- **Hero carousel** configuration for multiple slides with titles and descriptions

#### 🐛 Bug Fixes
- Fixed form validation styling with Bootstrap feedback classes
- Resolved mobile navigation issues with proper Bootstrap collapse
- Corrected pagination display for various screen sizes
- Fixed accessibility issues with proper ARIA labels
- Resolved search form reset functionality
- Fixed view toggle persistence across page navigation

#### 🔒 Security Improvements
- Proper escaping of all user-generated content
- Secure handling of theme settings and uploads
- Validation of user inputs in forms

### 📝 Notes
This major release represents a complete modernization of the theme with Bootstrap 5, focusing on improved user experience, mobile responsiveness, and maintainable code structure. The theme now provides a solid foundation for further customization and development.

---

## [1.9.1] - Previous Version
- Legacy default theme functionality
