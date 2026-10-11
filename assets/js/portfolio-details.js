/**
 * Portfolio Details Dynamic Renderer
 * Handles rendering the active project on portfolio-details.html based on URL parameter ?id=...
 */

document.addEventListener('DOMContentLoaded', function() {
  // 1. Get project ID from query params
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id') || urlParams.get('project') || 'greenbasket';

  // 2. Fetch project from data
  if (typeof portfolioProjects === 'undefined' || !Array.isArray(portfolioProjects)) {
    console.error('portfolioProjects data not loaded');
    return;
  }

  const project = getProjectById(projectId);
  const currentIndex = portfolioProjects.findIndex(p => p.id === project.id);
  const prevProject = portfolioProjects[(currentIndex - 1 + portfolioProjects.length) % portfolioProjects.length];
  const nextProject = portfolioProjects[(currentIndex + 1) % portfolioProjects.length];
  const relatedProjects = getRelatedProjects(project.id, 3);

  // 3. Update Page Title and Meta
  document.title = `${project.title} - Case Study | Eslam Elkayesh`;

  // 4. Update Breadcrumbs & Main Headings
  const breadcrumbCurrent = document.querySelector('.breadcrumbs .current');
  if (breadcrumbCurrent) breadcrumbCurrent.textContent = project.title;

  const pageTitleH1 = document.querySelector('.page-title h1');
  if (pageTitleH1) pageTitleH1.textContent = project.title;

  const sectionSub = document.querySelector('.portfolio-details .section-title .subtitle');
  if (sectionSub) sectionSub.textContent = project.categoryLabel;

  const sectionH2 = document.querySelector('.portfolio-details .section-title h2');
  if (sectionH2) sectionH2.textContent = project.title;

  const sectionP = document.querySelector('.portfolio-details .section-title p');
  if (sectionP) sectionP.textContent = project.tagline;

  // 5. Render Slider / Showcase Image
  const swiperWrapper = document.querySelector('.portfolio-details-slider .swiper-wrapper');
  if (swiperWrapper) {
    swiperWrapper.innerHTML = `
      <div class="swiper-slide">
        <a href="${project.image}" class="glightbox" data-gallery="project-gallery" title="${project.title} - Full Preview">
          <img src="${project.image}" alt="${project.title}" class="img-fluid rounded-4 shadow-lg w-100" style="object-fit: cover; max-height: 520px;">
          <div class="gallery-zoom-badge">
            <i class="bi bi-arrows-fullscreen"></i> Click to Zoom Full Resolution
          </div>
        </a>
      </div>
    `;
  }

  // 6. Render Status Banner
  const statusBannerContainer = document.getElementById('project-status-banner');
  if (statusBannerContainer) {
    if (project.status === 'live') {
      statusBannerContainer.innerHTML = `
        <div class="project-status-box status-live">
          <div class="status-indicator-dot live-pulse"></div>
          <div>
            <strong>Active Live Project:</strong> This website is actively online. You can explore the live production site directly at 
            <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="status-live-link">
              ${project.liveUrl} <i class="bi bi-box-arrow-up-right"></i>
            </a>
          </div>
        </div>
      `;
    } else {
      statusBannerContainer.innerHTML = `
        <div class="project-status-box status-archived">
          <div class="status-indicator-dot archived-dot"></div>
          <div>
            <strong>Archived Project (Domain Expired):</strong> The client's original domain has expired or moved offline, but the project implementation is fully documented and preserved below with high-resolution screenshots.
          </div>
        </div>
      `;
    }
  }

  // 7. Render Main Content (Overview, Highlights, Tech)
  const contentArea = document.querySelector('.portfolio-content');
  if (contentArea) {
    contentArea.innerHTML = `
      <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <h2 class="mb-0 text-white">${project.title}</h2>
        <span class="badge ${project.status === 'live' ? 'bg-success' : 'bg-warning text-dark'} px-3 py-2 rounded-pill fs-6">
          <i class="bi ${project.status === 'live' ? 'bi-check-circle-fill' : 'bi-clock-history'} me-1"></i>
          ${project.status === 'live' ? 'Live Online' : 'Domain Expired (Archive)'}
        </span>
      </div>

      <div class="meta-info mb-4">
        <span class="category"><i class="bi bi-tag"></i> ${project.categoryLabel}</span>
        <span class="date"><i class="bi bi-calendar"></i> ${project.date}</span>
        <span class="client"><i class="bi bi-building"></i> ${project.client}</span>
      </div>

      <div class="project-summary-box mb-4">
        <p class="lead">${project.description}</p>
      </div>

      <h3>Project Overview & Strategy</h3>
      <p>${project.overview}</p>

      <div class="highlights-box my-4">
        <h4>Key Implementations & Features</h4>
        <ul>
          ${project.highlights.map(h => `<li><i class="bi bi-check-circle-fill text-accent"></i> ${h}</li>`).join('')}
        </ul>
      </div>

      <h3>Technologies & Tools Used</h3>
      <div class="tech-stack-badges my-3">
        ${project.tech.map(t => `<span class="tech-badge"><i class="bi bi-code-slash"></i> ${t}</span>`).join('')}
      </div>

      <!-- Action Box -->
      <div class="project-cta-banner p-4 rounded-4 mt-5">
        <div class="row align-items-center">
          <div class="col-md-8">
            <h4 class="text-white mb-2">Interested in a similar project?</h4>
            <p class="text-white-50 mb-0">Let's build a modern, high-converting website tailored to your business needs.</p>
          </div>
          <div class="col-md-4 text-md-end mt-3 mt-md-0">
            <a href="https://wa.me/201500266012?text=Hello%20Eslam,%20I%20saw%20your%20project%20${encodeURIComponent(project.title)}%20and%20would%20like%20to%20discuss%20a%20website" target="_blank" class="btn btn-whatsapp">
              <i class="bi bi-whatsapp me-2"></i> WhatsApp Me
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // 8. Render Sidebar Details
  const infoCard = document.querySelector('.sidebar .info-card');
  if (infoCard) {
    let actionButtonHtml = '';
    if (project.status === 'live' && project.liveUrl) {
      actionButtonHtml = `
        <a href="${project.liveUrl}" class="btn-primary w-100 text-center mb-2" target="_blank" rel="noopener noreferrer">
          <i class="bi bi-box-arrow-up-right me-1"></i> Visit Live Website
        </a>
      `;
    } else {
      actionButtonHtml = `
        <a href="${project.image}" class="btn-primary w-100 text-center mb-2 glightbox" data-gallery="sidebar-preview" title="${project.title} - High Resolution Preview">
          <i class="bi bi-images me-1"></i> Preview Full Screenshots
        </a>
        <div class="text-muted small text-center mb-3">
          <i class="bi bi-info-circle"></i> Live domain is currently inactive
        </div>
      `;
    }

    infoCard.innerHTML = `
      <h3>Project Information</h3>
      <div class="info-item">
        <span class="label">Client</span>
        <span class="value">${project.client}</span>
      </div>
      <div class="info-item">
        <span class="label">Category</span>
        <span class="value">${project.categoryLabel}</span>
      </div>
      <div class="info-item">
        <span class="label">Year</span>
        <span class="value">${project.date}</span>
      </div>
      <div class="info-item">
        <span class="label">My Role</span>
        <span class="value">${project.role}</span>
      </div>
      <div class="info-item">
        <span class="label">Status</span>
        <span class="value ${project.status === 'live' ? 'text-success fw-bold' : 'text-warning fw-bold'}">
          <i class="bi ${project.status === 'live' ? 'bi-dot' : 'bi-dash'}"></i>
          ${project.status === 'live' ? 'Live Online' : 'Domain Expired'}
        </span>
      </div>
      <div class="info-item">
        <span class="label">Tech Stack</span>
        <span class="value">${project.tech.slice(0, 3).join(', ')}</span>
      </div>

      <div class="mt-4">
        ${actionButtonHtml}
        <a href="index.html#portfolio" class="btn btn-outline-light w-100 text-center">
          <i class="bi bi-grid-3x3-gap me-1"></i> Back to All Projects
        </a>
      </div>
    `;
  }

  // 9. Render Prev / Next Navigation Bar
  const navContainer = document.getElementById('project-prev-next-nav');
  if (navContainer) {
    navContainer.innerHTML = `
      <div class="project-nav-wrapper d-flex justify-content-between align-items-center flex-wrap gap-3 my-5 py-4 border-top border-bottom border-secondary border-opacity-25">
        <a href="portfolio-details.html?id=${prevProject.id}" class="nav-prev d-flex align-items-center gap-3 text-decoration-none">
          <div class="nav-arrow-circle"><i class="bi bi-arrow-left"></i></div>
          <div class="text-start">
            <span class="text-muted small d-block">Previous Project</span>
            <strong class="text-white">${prevProject.title}</strong>
          </div>
        </a>

        <a href="index.html#portfolio" class="btn btn-sm btn-outline-secondary px-3 py-2 rounded-pill">
          <i class="bi bi-grid"></i> All Projects
        </a>

        <a href="portfolio-details.html?id=${nextProject.id}" class="nav-next d-flex align-items-center gap-3 text-decoration-none">
          <div class="text-end">
            <span class="text-muted small d-block">Next Project</span>
            <strong class="text-white">${nextProject.title}</strong>
          </div>
          <div class="nav-arrow-circle"><i class="bi bi-arrow-right"></i></div>
        </a>
      </div>
    `;
  }

  // 10. Render Related Projects Grid
  const relatedContainer = document.getElementById('related-projects-grid');
  if (relatedContainer) {
    relatedContainer.innerHTML = relatedProjects.map(rp => `
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="portfolio-card related-card">
          <div class="portfolio-image-container">
            <img src="${rp.image}" alt="${rp.title}" class="img-fluid" loading="lazy">
            <div class="portfolio-overlay">
              <div class="portfolio-info">
                <span class="project-category">${rp.categoryLabel}</span>
                <h4>${rp.title}</h4>
              </div>
              <div class="portfolio-actions">
                <a href="portfolio-details.html?id=${rp.id}" class="btn-detail-link" title="View Case Study">
                  <span>View Details</span> <i class="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // 11. Re-init GLightbox for newly inserted DOM
  if (typeof GLightbox !== 'undefined') {
    GLightbox({
      selector: '.glightbox'
    });
  }
});
