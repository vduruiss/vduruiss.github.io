(() => {
  const currentYear = new Date().getFullYear();
  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = currentYear;
  });

  const search = document.querySelector('#publication-search');
  if (!search) return;

  const publications = [...document.querySelectorAll('.publication')];
  const sections = [...document.querySelectorAll('.publication-section')];
  const count = document.querySelector('#publication-count');
  const empty = document.querySelector('#no-results');
  const yearButtons = [...document.querySelectorAll('[data-filter-year]')];
  const statusButtons = [...document.querySelectorAll('[data-filter-status]')];
  const sourceLinkSelector = '.paper-links a[href*="arxiv.org"], .paper-links a[href*="openreview.net"], .paper-links a[href*="doi.org"], .paper-links a[href$=".pdf"], .paper-links a[href*="drive.google.com"], .paper-links a[href*="proceedings.mlr.press"]';
  let activeYear = 'all';
  let activeStatus = 'all';

  const abstractSummaries = [
    'The dissertation connects symplectic numerical integration with two areas of scientific computing. It develops geometric algorithms for accelerated optimization in vector spaces and on Riemannian manifolds, then designs structure-preserving networks for nearly periodic Hamiltonian systems and controlled dynamics on Lie groups.',
    'A physics-informed neural network identifies an approximate self-similar profile for the three-dimensional incompressible Euler equations on an unbounded domain at the critical blowup rate. Converting the profile to a spline makes the residuals and stability constants accessible to quantitative certification, providing evidence for stable finite-time singularity formation.',
    'The companion analysis reduces nonlinear stability of the approximate Euler profile to a finite collection of explicit estimates and computable constants. Once those quantities are rigorously certified, the framework closes the stability argument and reconstructs an admissible solution that becomes singular in finite physical time.',
    'Equation Recast absorbs parameter-induced changes in a PDE operator into effective source terms, allowing one canonical solution operator to serve an entire parameterized family. It enables zero-shot extrapolation, combines heterogeneous data in a shared representation, and uses failure of the recast iteration to flag unreliable predictions.',
    'A Fourier neural operator learns molecular quantum dynamics up to ten million times faster than GPU propagation. Its differentiable surrogate powers a stochastic planner that purifies a mixed distribution in an 888-dimensional hydronium subspace with shorter sequences and higher success than the reinforcement-learning baseline.',
    'A practice-oriented account derives the Fourier neural operator from operator theory and signal processing, then follows every component through spectral parameterization and implementation. The guide connects these foundations to NeuralOperator 2.0.0 and explains common design choices, constraints, and failure modes.',
    'The paper distills the conditions needed to turn familiar finite-dimensional neural architectures into well-defined maps between function spaces. The resulting recipe preserves discretization consistency while transferring the empirical strengths of established network designs to operator learning.',
    'NeuralOperator is an open-source PyTorch package for developing, training, and evaluating neural operators on functions represented at different discretizations. The official PyTorch ecosystem project combines tested model implementations, data processing, training utilities, and extensible research components.',
    'NOBLE maps interpretable neuron features and injected currents to distributions of somatic voltage responses through biologically informed latent embeddings. It reproduces experimental variability, generates realistic synthetic neurons, validates on experimental data, and runs about 4,200 times faster than the biophysical solver.',
    'Mollified graph neural operators make exact automatic differentiation available on irregular grids and varying geometries. They improve physics-loss accuracy, support physics-only learning on sparse point clouds, and enable inverse design and shape optimization through derivatives of the learned field.',
    'FC-PINO uses Fourier continuation to extend spectral physics losses to nonperiodic and nonsmooth PDE solutions. Its FC-Legendre and FC-Gram constructions suppress boundary artifacts while avoiding the resolution sensitivity of finite differences and the memory demands of automatic differentiation.',
    'A Fourier neural operator emulates second-harmonic generation in thin-film lithium niobate waveguides with roughly four percent relative error and about a 550,000-fold batched GPU speedup. Its differentiability enables direct optimization of waveguide geometry, poling mismatch, and pump energy for high conversion efficiency.',
    'A Fourier neural operator predicts complete population trajectories for driven 6-state and 12-state CaH+ systems with speedups of two to six orders of magnitude. The surrogate supports dense parameter exploration and gradient-based optimization of the driving frequency for quantum-state control.',
    'Boundary-Augmented Neural Operators explicitly model interactions between a domain and its boundary. Airfoil-flow and Poisson experiments show improved robustness across discretizations, point distributions, geometric shapes, and topological changes while retaining computational efficiency.',
    'A local three-dimensional neural operator built with continuous DISCO filters learns MRI reconstruction on coarse, memory-efficient volumes. The same model supports zero-shot or few-shot inference at higher resolutions without the aliasing and discretization sensitivity of standard 3D convolutions.',
    'FG-ConvNO combines geometry-aware encoding, interpolation-based decoding, global thrust supervision, and discretization-agnostic convolution blocks. On a low-data propeller CFD benchmark, it improves both surface-pressure and thrust prediction while remaining robust to irregular geometry sampling.',
    'A projection layer maps any operator surrogate output onto the function space satisfying a prescribed linear differential constraint. Implemented efficiently in Fourier space, it enforces divergence-free flow predictions to arbitrary accuracy with negligible extra cost and no loss of data fidelity.',
    'Projected neural differential equations enforce known invariants by projecting predicted velocities onto the tangent space of the constraint manifold. Across chaotic systems and power-grid models, the approach improves accuracy, stability, efficiency, and generalization with fewer hyperparameters than penalty methods.',
    'SROpNet treats spatiotemporal super-resolution as learning an operator from sparse or coarse observations to a continuous PDE solution. It accepts flexible sensor locations and evaluates the reconstructed field at arbitrary target points and resolutions.',
    'The symplectic gyroceptron learns discrete flow maps for nearly periodic Hamiltonian systems while preserving symplecticity and a discrete adiabatic invariant by construction. It produces stable long-horizon surrogates that can step over fast oscillatory time scales.',
    'LieFVIN learns controlled Lagrangian or Hamiltonian robot dynamics directly on matrix Lie groups from position-velocity or position-only data. Its discrete flow maps preserve both configuration geometry and symplectic structure, enabling fast prediction and scalable discrete optimal control.',
    'Adaptive Hamiltonian variational integrators combine the Poincaré time transformation with Type II and Type III generating functions to retain symplectic structure under adaptive stepping. Error analysis and Kepler experiments lead to efficient explicit algorithms for symplectic accelerated optimization.',
    'Time-dependent Bregman Lagrangian and Hamiltonian systems extend variational accelerated optimization from normed spaces to Riemannian manifolds. Their trajectories attain arbitrary polynomial convergence rates and retain a time-rescaling symmetry that guides geometric discretization.',
    'This concise proceedings paper presents the Riemannian extension of Bregman variational dynamics. It links arbitrary-rate continuous acceleration with the prospect of time-adaptive, symplectic, manifold-preserving optimization algorithms.',
    'Holonomic constraints are incorporated into variational integrators so accelerated Hamiltonian dynamics remain on embedded Riemannian manifolds. Experiments on eigenvalue and Procrustes problems study the resulting methods on spheres and Stiefel manifolds.',
    'Explicit Hamiltonian variational integrators are combined with projection steps to keep accelerated dynamics on a constraint manifold. The construction avoids the expensive implicit solves of earlier constrained schemes while retaining their geometric motivation.',
    'A time-adaptive framework for Lagrangian variational integrators extends naturally to manifolds where Hamiltonian formulations can be problematic. Applied to vector spaces and Lie groups, it combines adaptive resolution with the geometric structure of accelerated dynamics.',
    'Momentum restarting reduces oscillations in symplectic accelerated optimization and can remove the need for time adaptivity. Temporal looping controls finite-precision instability, while systematic comparisons identify robust integrators with simpler parameter tuning.',
    'Generalized local coordinates dynamically orthonormalize Gaussian Fisher-Rao geometry and exploit its sparse structure. This simplifies momentum-based Riemannian optimization and scales structured natural-gradient methods to larger numerical and learning problems.',
    'Generalized Riemannian normal coordinates locally convert optimization on structured positive-definite matrices into an unconstrained Euclidean problem. The resulting matrix-inverse-free second-order optimizers use only matrix multiplications and remain effective in low-precision deep learning.',
    'Two-parameter continuation and numerical simulation map the Mackey-Glass equation near the onset of chaos. The analysis reveals periodic and chaotic bistability, interior and boundary crises, subcritical period doubling, torus bifurcations, and a codimension-two fold-flip point.'
  ];

  const publicationYear = (publication) => {
    if (publication.dataset.year) return publication.dataset.year;
    const metadata = publication.querySelector('.venue')?.textContent || publication.querySelector('.authors')?.textContent || '';
    return metadata.match(/\b20\d{2}\b/)?.[0] || '';
  };

  const publicationStatus = (publication) => {
    const venue = publication.querySelector('.venue')?.textContent || '';
    return /preprint/i.test(venue) ? 'preprint' : 'published';
  };

  const decoratePublication = (publication, description) => {
    if (!description) return;

    const venue = publication.querySelector('.venue');
    if (venue && /preprint/i.test(venue.textContent)) {
      venue.classList.add('venue-preprint');
    } else if (venue && /workshop/i.test(venue.textContent)) {
      venue.classList.add('venue-workshop');
    } else if (venue) {
      venue.classList.add('venue-published');
    }
    const details = document.createElement('details');
    details.className = 'abstract-details';
    const summary = document.createElement('summary');
    summary.textContent = 'Paper summary';
    const abstractText = document.createElement('p');
    abstractText.textContent = description;
    const source = publication.querySelector(sourceLinkSelector);
    const sourceLink = source?.cloneNode(true);

    if (sourceLink) {
      sourceLink.className = 'abstract-source-link';
      sourceLink.textContent = 'Read the paper ↗';
      details.append(summary, abstractText, sourceLink);
    } else {
      details.append(summary, abstractText);
    }
    publication.querySelector('.publication-body')?.append(details);
  };

  const publicationRecords = publications.map((publication, index) => {
    decoratePublication(publication, abstractSummaries[index]);
    return {
      element: publication,
      searchText: publication.textContent.toLocaleLowerCase(),
      status: publicationStatus(publication),
      year: publicationYear(publication),
    };
  });

  const updatePublications = () => {
    const query = search.value.trim().toLocaleLowerCase();
    let visibleCount = 0;

    publicationRecords.forEach(({ element, searchText, status, year }) => {
      const matchesSearch = !query || searchText.includes(query);
      const matchesYear = activeYear === 'all' || year === activeYear;
      const matchesStatus = activeStatus === 'all' || status === activeStatus;
      const isVisible = matchesSearch && matchesYear && matchesStatus;
      element.hidden = !isVisible;
      if (isVisible) visibleCount += 1;
    });

    sections.forEach((section) => {
      section.hidden = !section.querySelector('.publication:not([hidden])');
    });

    count.textContent = String(visibleCount);
    empty.hidden = visibleCount !== 0;
  };

  search.addEventListener('input', updatePublications);

  const activate = (buttons, selected) => {
    buttons.forEach((button) => {
      const isActive = button === selected;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
  };

  yearButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeYear = button.dataset.filterYear;
      activate(yearButtons, button);
      updatePublications();
    });
  });

  statusButtons.forEach((button) => {
    button.addEventListener('click', () => {
      activeStatus = button.dataset.filterStatus;
      activate(statusButtons, button);
      updatePublications();
    });
  });
})();
