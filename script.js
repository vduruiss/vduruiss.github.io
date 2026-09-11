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
    'A Fourier neural operator learns control-conditioned molecular and motional population dynamics in an 888-dimensional subspace of hydronium at 20 K. For most test frequencies, its time-averaged population infidelity remains below 0.003, and batched frequency evaluation is up to 18.4 million times faster than direct CUDA-Q mixed-state propagation. The FNO-guided stochastic pulse-measurement planner uses this differentiable surrogate to design sequences that purify an initially mixed thermal distribution. It reaches a target-state population of 0.98 with up to 86.2% success and, in a shared discrete control space, nearly doubles the success rate of the reinforcement-learning baseline while using roughly half as many pulses.',
    'This comprehensive guide connects the operator-theoretic and signal-processing foundations of Fourier neural operators to their computational implementation. It explains the spectral parameterization, every architectural component, practical design choices, computational constraints, and common misconceptions. The treatment also discusses extensions beyond regular periodic grids and clarifies how discretization and resolution affect an FNO in practice. Its examples are integrated with NeuralOperator 2.0.0 to provide a reproducible foundation for building, evaluating, and extending FNO models.',
    'This paper identifies the mathematical and implementation principles required for a parametrized model to define a discretization-convergent map between function spaces. It provides a common recipe for extending multilayer perceptrons, convolutions, graph networks, attention mechanisms, and encoder-decoder architectures into neural operators. The construction uses spatial coordinates, domain-scaled receptive fields, and quadrature-weighted aggregation so that layers converge as a discretization is refined. Numerical studies examine resolution transfer, multi-resolution training, kernel interpolation, and the loss of information caused by fixed-resolution input and output interpolation.',
    'NeuralOperator is an open-source Python library for developing, training, and deploying models that learn mappings between function spaces. Models can be trained and evaluated on input and output functions represented at different discretizations, supporting the discretization-convergent behavior expected of neural operators. The package combines tested implementations, training tools, and extensible components behind a consistent PyTorch interface. As part of the official PyTorch ecosystem, it is intended to support both reproducible use of established methods and the development of new architectures.',
    'NOBLE learns somatic voltage responses from injected currents and continuous, biologically informed embeddings of interpretable neuron features. Trained on families of biophysically detailed models, it represents distributions of neuronal dynamics rather than one deterministic response and captures both subthreshold behavior and spiking variability. Experiments on PVALB and VIP cell types demonstrate generalization to unseen PVALB models and show that interpolation in the learned embedding produces synthetic neurons whose responses align with human cortical recordings. Batched inference is about 4,200 times faster than the numerical solver while retaining key electrophysiological features.',
    'Mollified graph neural operators replace discontinuous neighborhood indicators with smooth kernels, making their outputs differentiable with respect to query coordinates on irregular grids and changing geometries. Automatic differentiation then supplies exact coordinate derivatives for physics losses at randomly sampled points, including physics-only learning on sparse point clouds. On a regular-grid PDE, pairing the method with automatic differentiation reduces relative data error by 20 times compared with finite-difference derivatives. On unstructured point clouds, it achieves errors about two orders of magnitude below the Meta-PDE learning baseline at comparable runtimes and also supports differentiable shape optimization.',
    'FC-PINO extends physics-informed neural operators to nonperiodic and nonsmooth PDEs by incorporating Fourier continuation into spectral differentiation. Its FC-Legendre and FC-Gram variants construct well-conditioned periodic extensions, enabling fast and accurate derivatives without the resolution sensitivity of finite differences or the memory overhead of automatic differentiation. Across challenging nonperiodic benchmarks, standard PINO fails without padding or remains inaccurate with padding near domain boundaries. FC-PINO instead delivers substantially more accurate, robust, and scalable high-precision solutions.',
    'A Fourier neural operator learns the nonlinear map from input optical waveforms and thin-film lithium niobate waveguide parameters to the output field for second-harmonic generation. On previously unseen designs, it reaches about 4% relative error and an approximately 550,000-fold batched GPU speedup over the reference split-step solver. The differentiable surrogate enables gradient-based inverse design of waveguide top width, etch depth, poling mismatch, and pump-pulse energy. Across 1,000 random initializations, 75% of the optimized designs exceed 85% conversion efficiency within 100 iterations, reducing the reported design cycle from days or weeks to seconds.',
    'A Fourier neural operator learns complete population trajectories for driven 6-state and 12-state CaH+ systems from the initial populations and a constant laser frequency. A sinusoidal detuning embedding encodes the oscillatory phase information needed to reproduce carrier and blue-sideband transitions. The average maximum error across states remains below 0.012, while batched inference is about 344 times faster for the 6-state system and 9.77 million times faster for the 12-state system than the reported reference solver. The surrogate supports both dense frequency searches and gradient-based optimization of drive frequency and stopping time for quantum-state control.',
    'Boundary-Augmented Neural Operators explicitly model interactions between a domain boundary and its interior, addressing geometric information that coordinate-only operator models can overlook. An efficient realization processes the lower-dimensional boundary separately before coupling it to the full domain. Tests on an airfoil-flap dataset and a new Poisson-equation dataset compare the approach with existing neural operators. The results show improved generalization to unseen geometries and topological changes, together with robustness to changes in discretization and point distribution.',
    'This work introduces a local three-dimensional neural operator based on continuous DISCO filters for accelerated MRI reconstruction. The continuous filters preserve local spatial inductive biases without tying the model to one training resolution or introducing the aliasing associated with interpolated convolution kernels. The model can be trained with full backpropagation on coarse, memory-efficient volumes and then applied through zero-shot or few-shot inference at finer resolutions. Experiments on SKM-TEA show accurate reconstruction with strong runtime and memory efficiency, and the formulation also applies to other voxel-based imaging tasks.',
    'FG-ConvNO is a geometry-aware neural operator for predicting surface pressure and global thrust from propeller CFD data in a limited-data regime. It combines signed-distance and surface-normal encoding, interpolation-based decoding, global-quantity supervision, and DISCO convolution blocks with resolution-consistent receptive fields. On a procedurally generated propeller dataset, it obtains the lowest reported surface-pressure error and reduces global prediction loss by two to four times relative to the principal operator baselines. Architectural simplification and random vertex subsampling further improve stability and generalization across complex geometries.',
    'This work adds a model-agnostic projection layer that maps the output of any neural operator onto the space of functions satisfying a specified differential constraint. For linear constraints, the projection becomes a linearly constrained least-squares problem that can be solved efficiently in a suitable transformed function space. The layer can be applied during training or inference without redesigning the underlying operator architecture. For incompressible flow, a Fourier-space implementation enforces divergence-free predictions throughout the spatiotemporal domain to arbitrary numerical accuracy.',
    'Projected neural differential equations enforce known constraints by projecting predicted velocities onto the tangent space of the constraint manifold. This hard geometric correction keeps the learned vector field compatible with the constraints without relying on a penalty term or a tuned loss weight. Tests span several challenging systems, including chaotic dynamics and state-of-the-art power-grid models. The method outperforms the constraint-enforcement baselines considered in the paper while requiring fewer hyperparameters and less computation.',
    'SROpNet formulates spatiotemporal super-resolution as learning an operator from low-resolution simulations to a continuous representation of a parametric PDE solution. A fixed number of input sensors may occupy arbitrary spatiotemporal locations, so the observations need not lie on a regular grid. Once learned, the continuous representation can be evaluated at any desired spatial or temporal coordinate to recover fine-scale solution values. This makes the framework applicable to sampling configurations and output resolutions that fixed-grid super-resolution models cannot naturally accommodate.',
    'The symplectic gyroceptron is a structure-preserving neural architecture for approximating discrete flow maps of nearly periodic Hamiltonian systems. Its construction guarantees that the learned surrogate is both symplectic and nearly periodic, which gives rise to a formal discrete adiabatic invariant. These properties provide a mechanism for long-time stability while allowing the learned map to step over fast oscillatory timescales. Numerical examples on coupled oscillators and charged-particle dynamics illustrate the advantages over unconstrained surrogate maps.',
    'LieFVIN learns controlled Lagrangian or Hamiltonian dynamics directly on matrix Lie groups from position and velocity data or from position-only observations. Its discrete-time flow maps preserve both the Lie-group configuration geometry and the underlying symplectic structure by design. Because it learns the flow map rather than a continuous vector field, prediction does not require repeated numerical integration, neural ODE solvers, or adjoint calculations. The learned dynamics can then be used with scalable discrete-time optimal-control methods for wheeled, aerial, and underwater rigid-body systems.',
    'This paper develops adaptive time-stepping methods that retain the symplectic structure needed for reliable long-time Hamiltonian simulation. It combines the Poincaré time transformation with Hamiltonian variational integrators based on Type II and Type III generating functions, since the transformed Hamiltonian is generally degenerate. The analysis includes error estimates and numerical tests on the Kepler two-body problem. Applied to the variational formulation of accelerated optimization, the same framework produces efficient explicit symplectic optimization algorithms.',
    'This paper extends the variational formulation of accelerated optimization from normed vector spaces to Riemannian manifolds. It constructs time-dependent Bregman Lagrangian and Hamiltonian systems whose trajectories remain intrinsic to the manifold geometry. Along these continuous trajectories, the objective can attain an arbitrary polynomial convergence rate of order 1/t^p. A corresponding time-invariance property motivates optimization algorithms that combine adaptivity, symplectic integration, and manifold preservation.',
    'This two-page proceedings contribution summarizes the variational framework for accelerated optimization on Riemannian manifolds. It presents the central idea that time-dependent Bregman Lagrangian and Hamiltonian systems can generate intrinsic optimization trajectories with arbitrary polynomial convergence rates. It also highlights the time-invariance structure that motivates adaptive geometric discretizations. The contribution is best read as a concise overview of the broader research program rather than as a separate algorithmic study.',
    'This work develops accelerated optimization algorithms for Riemannian manifolds represented as holonomically constrained submanifolds of Euclidean space. It incorporates the constraints into continuous and discrete Type I, Type II, and Type III variational principles, producing implicit manifold-preserving integrators with an accompanying error analysis. Numerical experiments address generalized eigenvalue and Procrustes problems on spheres and Stiefel manifolds. The adaptive Hamiltonian approach is substantially more efficient than its direct counterpart and can outperform Euler-Lagrange discretizations and Riemannian gradient descent when appropriately tuned.',
    'This paper investigates explicit projected alternatives to the implicit constrained variational integrators used for Riemannian accelerated optimization. Each variational update is followed by inexpensive projections onto the constraint manifold and the appropriate tangent or cotangent spaces. For generalized eigenvalue and Procrustes problems on spheres and Stiefel manifolds, the projected method closely matches the iteration behavior of the implicit approach. When the required projections are available in closed form, it reduces runtime by several orders of magnitude and simplifies implementation and tuning.',
    'This work derives time adaptivity directly from a Lagrangian variational principle, providing an intrinsic construction for manifolds and Lie groups. The formulation avoids relying on Hamiltonian coordinates tied to an ambient vector space while retaining the geometric structure of variational integration. In vector spaces, the adaptive Lagrangian and Hamiltonian methods show comparable optimization behavior. On the rotation group, the explicit Lagrangian method solves Wahba’s problem in fewer and substantially cheaper iterations than an implicit adaptive Lie-group integrator.',
    'This study examines the practical choices that determine the performance of symplectic accelerated optimization algorithms. Momentum restarting suppresses oscillatory overshoot, improves robustness, and largely removes the practical advantage of time adaptivity. Temporal looping prevents instability caused by finite numerical precision without materially reducing efficiency. Experiments across numerical optimization and machine-learning objectives show that the simplified algorithms are easier to tune and can achieve accuracy and computational performance comparable to Adam.',
    'This workshop paper introduces generalized local coordinates for momentum-based optimization on Gaussian Fisher-Rao manifolds. The coordinates exploit sparse structure and locally simplify the metric, providing efficient approximations to the differential equations that define exponential and parallel-transport maps. The resulting update is numerically stable and extends structured natural-gradient descent with momentum. The approach is designed to scale these Riemannian methods to larger problems in numerical optimization and deep learning.',
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
