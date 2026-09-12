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
    'The dissertation connects symplectic numerical integration with accelerated optimization and structure-preserving dynamics learning. For accelerated optimization, it develops geometric algorithms on vector spaces and Riemannian manifolds, with attention to time adaptivity, constraints, numerical stability, and computational efficiency. For dynamics learning, it constructs neural architectures for nearly periodic Hamiltonian systems and controlled dynamics on matrix Lie groups. Across both areas, symplectic structure guides algorithms designed for improved long-time fidelity and robustness.',
    'Using a physics-informed neural network with a self-similar ansatz, this work discovers a high-accuracy singular profile for the axisymmetric three-dimensional Euler equations on ℝ³ at the critical blowup rate λ = 0.5. Converting the learned profile into piecewise polynomial splines enables rigorous residual evaluation and makes the constants needed for stability analysis computationally accessible. The associated transport field suggests that linear damping can be established throughout the unbounded domain. Together with a complete nonlinear stability framework, the result provides strong evidence for a stable self-similar finite-time singularity and reduces a rigorous proof to finitely many quantitative estimates.',
    {
      before: 'This companion analysis paper for ',
      title: 'Stable Singularity of the Euler Equations on ℝ³',
      after: ' reduces nonlinear stability of the approximate Euler profile to a finite collection of explicit estimates and computable constants. It derives perturbation and modulation equations, then combines low- and high-order weighted energy estimates to control the linearized dynamics, nonlinear interactions, and modulation parameters. Once those quantities are rigorously certified, the framework closes the stability argument and reconstructs an admissible solution that becomes singular in finite physical time.',
    },
    'Equation Recast analytically absorbs parameter-dependent changes in a PDE operator into effective source terms, allowing one learned canonical solution operator to represent an entire parametric family. The formulation supports zero-shot extrapolation to unseen parameter regimes and combines sparse, heterogeneous datasets in a shared representation. Across multi-parameter, nonlinear, and singular PDEs, loss of convergence in the recast iteration acts as an internal warning of unreliable inference. In high-fidelity tokamak simulations, the method unifies electron-temperature data from four device geometries within one jointly trained operator.',
    'A Fourier neural operator provides a fast, differentiable surrogate for high-dimensional molecular quantum dynamics. The resulting stochastic planner designs pulse and measurement sequences that purify a thermal hydronium population in an 888-dimensional subspace. It reaches a target-state population of 0.98 with up to 86.2% success, outperforming the reinforcement-learning baseline with shorter sequences and reducing planning time from roughly 10 hours to between 10 and 20 minutes.',
    'This comprehensive guide connects the operator-theoretic and signal-processing foundations of Fourier neural operators to their computational implementation. It explains the spectral parameterization, every architectural component, practical design choices, computational constraints, and common misconceptions. The treatment also discusses extensions beyond regular periodic grids and clarifies how discretization and resolution affect an FNO in practice. Its examples are integrated with NeuralOperator 2.0.0 to provide a reproducible foundation for building, evaluating, and extending FNO models.',
    'This paper distills the principles needed to turn finite-dimensional neural architectures into discretization-convergent maps between function spaces. It gives a common recipe for extending multilayer perceptrons, convolutions, graph networks, attention, and encoder-decoder models into neural operators through coordinates, domain-scaled receptive fields, and quadrature-aware aggregation. Experiments demonstrate resolution transfer, multi-resolution training, and the consequences of interpolation at fixed input and output resolutions.',
    'NeuralOperator is an open-source PyTorch library for training, evaluating, and deploying models that learn maps between function spaces. It supports inputs and outputs represented at different discretizations and packages tested implementations and extensible tools behind a consistent interface. The library makes established neural operators easier to reproduce while providing a foundation for developing new architectures.',
    'NOBLE is a scalable neural operator that maps injected currents and interpretable neuron features to distributions of somatic voltage responses, capturing intrinsic variability rather than a single deterministic trace. Its biologically informed continuous latent space reproduces subthreshold and spiking diversity, generalizes to unseen neuron models, and generates synthetic neurons with trial-to-trial variability consistent with human cortical recordings. As the first scaled-up deep-learning framework for neuron dynamics validated on real experimental data, NOBLE delivers batched inference about 4,200 times faster than numerical solvers and opens a practical path toward population-scale biorealistic modeling.',
    'Mollified graph neural operators replace discontinuous neighborhoods with smooth kernels, enabling exact coordinate derivatives through automatic differentiation on irregular grids and changing geometries. This supports physics losses at randomly sampled points and even physics-only learning on sparse point clouds. Across benchmark PDEs, the method substantially improves accuracy over finite-difference and Meta-PDE baselines at comparable runtimes while also supporting differentiable shape optimization.',
    'FC-PINO extends physics-informed neural operators to nonperiodic and nonsmooth PDEs by incorporating Fourier continuation into spectral differentiation. Its FC-Legendre and FC-Gram variants construct well-conditioned periodic extensions, enabling fast and accurate derivatives without the resolution sensitivity of finite differences or the memory overhead of automatic differentiation. Across challenging nonperiodic benchmarks, standard PINO fails without padding or remains inaccurate with padding near domain boundaries. FC-PINO instead delivers substantially more accurate, robust, and scalable high-precision solutions.',
    'A Fourier neural operator learns the map from input optical waveforms and thin-film lithium niobate waveguide parameters to the output field for second-harmonic generation. On unseen designs, it achieves about 4% relative error and an approximately 550,000-fold batched GPU speedup over the reference split-step solver. The differentiable surrogate enables gradient-based optimization of waveguide geometry, poling mismatch, and pump energy, with 75% of 1,000 runs exceeding 85% conversion efficiency within 100 iterations.',
    'A Fourier neural operator learns population trajectories for driven 6-state and 12-state CaH+ systems, using a sinusoidal detuning embedding to capture their oscillatory response. It keeps the average maximum state error below 0.012 while accelerating batched simulation by about 344 times and 9.77 million times, respectively. The differentiable surrogate supports dense frequency searches and gradient-based optimization of drive frequency and stopping time for quantum control.',
    'Boundary-Augmented Neural Operators couple lower-dimensional boundary data to the domain interior, capturing geometric information that coordinate-only models can miss. Evaluations on airfoil-flap and Poisson-equation datasets compare the approach with established neural operators. The method generalizes better to unseen geometries and topological changes while remaining robust to changes in discretization and point distribution.',
    'This work introduces a local three-dimensional neural operator with continuous DISCO filters for accelerated MRI reconstruction. Its resolution-consistent filters preserve local spatial structure while enabling memory-efficient training on coarse volumes and zero-shot or few-shot inference at finer resolutions. On SKM-TEA, the method delivers accurate reconstructions with favorable runtime and memory use, and the formulation extends to other voxel-based imaging tasks.',
    'FG-ConvNO predicts surface pressure and global thrust from propeller CFD data in a limited-data regime. It combines geometric encodings, interpolation-based decoding, global thrust supervision, and DISCO convolution blocks with resolution-consistent receptive fields. On a procedurally generated propeller dataset, it achieves the lowest reported surface-pressure error and reduces global prediction loss by two to four times relative to the principal operator baselines.',
    'This work adds a model-agnostic projection layer that makes the output of any neural operator satisfy a specified differential constraint. For linear constraints, the projection becomes a linearly constrained least-squares problem that can be solved efficiently in a transformed function space during training or inference. A Fourier-space implementation enforces divergence-free incompressible-flow predictions throughout the spatiotemporal domain to numerical accuracy.',
    'Projected neural differential equations enforce known constraints by projecting predicted velocities onto the tangent space of the constraint manifold. This hard geometric correction keeps the learned vector field compatible with the constraints without relying on a penalty term or a tuned loss weight. Tests span several challenging systems, including chaotic dynamics and state-of-the-art power-grid models. The method outperforms the constraint-enforcement baselines considered in the paper while requiring fewer hyperparameters and less computation.',
    'SROpNet casts spatiotemporal super-resolution as learning an operator from coarse PDE simulations and problem parameters to a continuous high-resolution solution. It accepts a fixed number of observations at arbitrary space-time locations and can evaluate the learned solution at any coordinates, accommodating irregular sampling, moving sensors, and adaptive meshes. Experiments on parametric one- and two-dimensional diffusion equations and two-dimensional Kolmogorov flow demonstrate reconstruction across varying initial conditions, forcing terms, diffusion coefficients, Reynolds numbers, and sensor locations.',
    'The symplectic gyroceptron is a structure-preserving neural architecture for approximating discrete flow maps of nearly periodic Hamiltonian systems. Its construction guarantees that the learned surrogate is both symplectic and nearly periodic, which gives rise to a formal discrete adiabatic invariant. These properties provide a mechanism for long-time stability while allowing the learned map to step over fast oscillatory timescales. Numerical examples on coupled oscillators and charged-particle dynamics illustrate the advantages over unconstrained surrogate maps.',
    'LieFVIN learns controlled Lagrangian or Hamiltonian dynamics directly on matrix Lie groups from position and velocity data or from position-only observations. Its discrete-time flow maps preserve both the Lie-group configuration geometry and the underlying symplectic structure by design. Because it learns the flow map rather than a continuous vector field, prediction does not require repeated numerical integration, neural ODE solvers, or adjoint calculations. The learned dynamics can then be used with scalable discrete-time optimal-control methods for wheeled, aerial, and underwater rigid-body systems.',
    'This paper develops a systematic framework for adaptive symplectic integration by combining the Poincaré time transformation with Hamiltonian variational integrators. Because the transformed Hamiltonian is generally degenerate, the construction uses Type II and Type III generating functions, with error analysis and numerical validation on the Kepler two-body problem. Applied to Bregman Hamiltonian dynamics, the framework yields explicit variational and nonvariational optimization algorithms. On the test problem, the adaptive symplectic method requires far fewer iterations than direct integration and outperforms the non-symplectic ODE solvers considered.',
    'This paper extends the variational formulation of accelerated optimization from normed vector spaces to Riemannian manifolds. It constructs time-dependent Bregman Lagrangian and Hamiltonian systems whose trajectories remain intrinsic to the manifold geometry. Along these continuous trajectories, the objective can attain an arbitrary polynomial convergence rate of order 1/t^p. A corresponding time-invariance property motivates optimization algorithms that combine adaptivity, symplectic integration, and manifold preservation.',
    'This two-page proceedings contribution summarizes a talk on the variational formulation of accelerated optimization. It recalls how time-dependent Bregman Lagrangian and Hamiltonian flows yield arbitrary polynomial convergence rates in continuous time, then outlines the extension from normed vector spaces to Riemannian manifolds. It is a concise overview of the broader research program rather than a separate methodological study.',
    'This paper develops manifold-preserving accelerated optimization algorithms by incorporating holonomic constraints into discrete Type I, Type II, and Type III variational principles. It establishes the constrained discrete equations and their error analysis, then applies the resulting methods to eigenvalue and Procrustes problems on spheres and Stiefel manifolds. The adaptive Hamiltonian method requires fewer iterations than its direct counterpart, Euler-Lagrange discretizations, and Riemannian gradient descent, although its implicit constraint solves increase the cost per iteration and require careful tuning.',
    'This paper replaces implicit constrained variational solves with explicit ambient-space Hamiltonian updates followed by projections onto the manifold and its tangent or cotangent spaces. On eigenvalue and Procrustes problems over spheres and Stiefel manifolds, the adaptive projected method outperforms the direct approach, Euler-Lagrange discretizations, and Riemannian gradient descent in iteration count. When the projections are available in closed form, it is easier to implement and tune than the implicit method and reduces runtime by three to four orders of magnitude in the reported tests.',
    'This paper derives the Poincaré time transformation from a variational principle and uses that insight to construct time-adaptive Lagrangian mechanics and variational integrators intrinsic to manifolds. Applied to Bregman dynamics on vector spaces, the Lagrangian algorithms closely match their Hamiltonian counterparts and preserve the efficiency gained by combining adaptivity with symplectic integration. The construction extends naturally to Lie groups, where an explicit integrator solves Wahba’s problem on SO(3) in fewer and substantially cheaper iterations than the implicit adaptive Lie-group method used for comparison.',
    'This study examines the practical choices that determine the performance of symplectic accelerated optimization algorithms. Momentum restarting suppresses oscillatory overshoot, improves robustness, and largely removes the practical advantage of time adaptivity. Temporal looping prevents instability caused by finite numerical precision without materially reducing efficiency. Experiments across numerical optimization and machine-learning objectives show that the simplified algorithms are easier to tune and can achieve accuracy and computational performance comparable to Adam.',
    'This workshop paper introduces generalized local coordinates for momentum-based optimization on Gaussian Fisher-Rao manifolds. By exploiting sparsity and locally simplifying the metric, the coordinates provide efficient approximations to exponential and parallel-transport maps. The resulting method extends structured natural-gradient descent with stable momentum updates designed for large optimization and deep-learning problems.',
    'This work introduces generalized Riemannian normal coordinates for optimization over structured symmetric positive-definite matrices with the affine-invariant metric. The coordinates dynamically orthonormalize the metric and locally turn the constrained manifold problem into an unconstrained Euclidean one. This avoids the difficult differential equations normally required to keep momentum-based iterates on the submanifold. The resulting matrix-inverse-free second-order optimizers use only matrix multiplications and remain effective in low-precision deep-learning settings.',
    'Two-parameter numerical continuation and direct simulation map the behavior of the Mackey-Glass delay equation near the onset of chaos. A cusp bifurcation and branches of folds of periodic orbits partition parameter space and create bistability between periodic solutions, followed by coexistence of a periodic orbit and a chaotic attractor. The study identifies interior and boundary crises as two distinct mechanisms that destroy the chaotic attractor, along with a separate route involving subcritical period doubling. Torus bifurcations, a codimension-two fold-flip point, and Lyapunov-exponent calculations complete the picture of the chaotic regions.'
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
    if (typeof description === 'string') {
      abstractText.textContent = description;
    } else {
      const title = document.createElement('em');
      title.textContent = description.title;
      abstractText.append(description.before, title, description.after);
    }
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
