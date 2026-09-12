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
    'Equation Recast rewrites a parameter-dependent family of PDEs so that predictions can be made by repeatedly applying a neural operator learned for one reference equation. The effect of changing physical parameters is derived from the known equations and moved into an effective source term, which is updated together with the solution through a fixed-point iteration. This lets one model extrapolate to unseen parameter regimes and combine sparse datasets collected under different conditions, while failure of the iteration to converge provides an internal warning that the prediction may be unreliable. Tests cover linear, nonlinear, and nearly singular PDEs, including electron-temperature evolution across four tokamak geometries with a single operator.',
    'A Fourier neural operator learns molecular and motional population dynamics from an initial distribution, laser frequency, and polarization, replacing repeated CUDA-Q propagation with a differentiable surrogate that is up to 18.4 million times faster. For inverse design, the FNO stochastic pulse-measurement planner searches over pulse frequencies, polarizations, and durations. It accounts for the possible outcomes of intermediate projective measurements while building a control sequence that purifies a 20 K hydronium ensemble into one target state within an 888-dimensional subspace. The resulting sequences reach 0.98 target-state population with up to 86.2% success, nearly twice the success of a reinforcement-learning planner with roughly half as many pulses, while reducing sequence generation from about 10 hours to 10 to 20 minutes.',
    'This comprehensive guide connects the operator-theoretic and signal-processing foundations of Fourier neural operators to their computational implementation. It explains the spectral parameterization, every architectural component, practical design choices, computational constraints, and common misconceptions. The treatment also discusses extensions beyond regular periodic grids and clarifies how discretization and resolution affect an FNO in practice. Its examples are integrated with NeuralOperator 2.0.0 to provide a reproducible foundation for building, evaluating, and extending FNO models.',
    'This paper distills the principles needed to turn finite-dimensional neural architectures into discretization-convergent maps between function spaces. It gives a common recipe for extending multilayer perceptrons, convolutions, graph networks, attention, and encoder-decoder models into neural operators through coordinates, domain-scaled receptive fields, and quadrature-aware aggregation. Experiments demonstrate resolution transfer, multi-resolution training, and the consequences of interpolation at fixed input and output resolutions.',
    'NeuralOperator is an open-source PyTorch library that provides the full workflow for training and deploying neural operators, from data processing to tested models, losses, and trainers. Its components preserve the resolution-agnostic behavior of operator models, allowing input and output functions to be represented at different discretizations. The modular interface makes established methods easier to reproduce and new operator architectures easier to develop.',
    'NOBLE is the first scaled-up deep-learning framework to capture experimental variability in fast neuron dynamics and validate its predictions against recordings from the human cortex. It learns one neural operator across an ensemble of biorealistic neuron models rather than fitting a separate deterministic model for each neuron. Given an injected current and a latent description built from interpretable electrophysiological features, the operator predicts the somatic voltage response, while variation across the latent space reproduces diverse spiking and subthreshold behavior. The representation generalizes to unseen PVALB and VIP model instances, can be interpolated to generate new synthetic neurons, and runs about 4,200 times faster than the numerical solver.',
    'Graph neural operators usually aggregate information only from points inside a fixed neighborhood. The abrupt boundary of that neighborhood creates discontinuities as the query coordinates move, preventing useful spatial derivatives from being obtained with standard automatic differentiation. Mollified graph neural operators replace the abrupt cutoff with a smooth, compactly supported weight, making the learned output differentiable with respect to its query coordinates. This enables physics-informed training on irregular grids, sparse point clouds, and changing geometries, while also supporting differentiable shape optimization.',
    'FC-PINO extends physics-informed neural operators to nonperiodic and nonsmooth PDEs by incorporating Fourier continuation into spectral differentiation. Its FC-Legendre and FC-Gram variants construct well-conditioned periodic extensions, enabling fast and accurate derivatives without the resolution sensitivity of finite differences or the memory overhead of automatic differentiation. Across challenging nonperiodic benchmarks, standard PINO fails without padding or remains inaccurate with padding near domain boundaries. FC-PINO instead delivers substantially more accurate, robust, and scalable high-precision solutions.',
    'This work trains a Fourier neural operator to predict the complex output field produced when an optical pulse propagates through a thin-film lithium niobate waveguide and generates its second harmonic. The model takes the input waveform together with the pump energy, waveguide width, etch depth, and poling-period mismatch, achieving about 4% relative error on unseen configurations and a roughly 550,000-fold batched GPU speedup over Fourier split-step simulation. For inverse design, gradients through the surrogate adjust the device geometry and operating parameters to maximize the fraction of optical energy converted to the second harmonic. Across 1,000 random initial designs, 75% exceed 85% conversion efficiency within 100 optimization steps.',
    'A Fourier neural operator learns the population dynamics of two driven CaH+ quantum systems from their initial populations and a constant laser frequency. It accurately predicts complete trajectories while accelerating batched simulation by about 344 times for the 6-state system and 9.77 million times for the 12-state system. For inverse design, the surrogate identifies the drive frequency and stopping time that steer the population toward a desired target state as quickly as possible. The paper explores both dense search and gradient-based optimization, with the latter offering better scalability to larger control spaces.',
    'Boundary-Augmented Neural Operators explicitly model how boundary geometry and conditions influence the solution throughout a domain. A practical realization processes the lower-dimensional boundary and full domain separately, retaining efficiency while coupling their representations. Tests on airfoil-flap and Poisson-equation datasets show improved generalization to unseen geometries and topologies, together with robustness to changes in discretization and point distribution.',
    'Three-dimensional MRI reconstruction is limited by the memory required for high-resolution volumes, while standard convolutional models can become tied to the voxel resolution and sampling pattern used during training. This work replaces fixed discrete kernels with local three-dimensional discrete-continuous filters, known as DISCO filters, that preserve local image structure while remaining consistent across resolutions. The model can therefore be trained with full backpropagation on coarse, memory-efficient volumes and transferred directly, or with limited fine-tuning, to finer reconstructions without interpolating its kernels. Results on SKM-TEA show accurate reconstruction from undersampled MRI measurements with favorable runtime and memory use, and the same construction can be applied to other forms of three-dimensional voxel data.',
    'FG-ConvNO is a geometry-aware neural operator for learning continuous surface fields and global physical quantities on complex shapes when high-fidelity training data are limited. It encodes irregular surface points using distance and normal information, exchanges features with factorized latent grids, and uses continuous convolution blocks that can be evaluated at new mesh resolutions. An auxiliary training objective helps the model learn global integral quantities alongside the local field. The paper evaluates the general architecture on propeller CFD, where it improves predictions of surface pressure, thrust, and torque over the tested graph and operator baselines and remains stable on finer meshes.',
    'This work enforces a prescribed physics constraint by projecting the output function of any neural operator onto the set of functions that satisfy it. The projection can be added during training or applied only at inference, without redesigning the underlying operator architecture. For linear differential constraints, the calculation is performed in a transform domain where it becomes an efficient constrained least-squares problem for the spectral coefficients, enforcing the condition across the full discretized spacetime domain rather than only at selected points. The paper demonstrates the framework using incompressible flow as an example, projecting predicted velocity fields to be divergence-free to numerical precision.',
    'Projected neural differential equations enforce known algebraic constraints by correcting the learned velocity at every state. The correction projects the velocity onto the tangent space of the constraint manifold, so the resulting continuous trajectory remains physically admissible without a penalty loss or a tuned constraint weight. Analytic formulas for the projection and its gradients keep training efficient and allow the model to work in convenient Cartesian coordinates rather than problem-specific generalized coordinates. Tests on conserved systems, chaotic multi-pendula, and a 14-bus power grid show near-machine-precision constraint satisfaction and more stable long-term predictions than the stabilization methods used for comparison.',
    'SROpNet frames spatiotemporal super-resolution as learning an operator from coarse simulations and PDE parameters to a continuous solution field. A fixed number of input observations may lie at arbitrary space-time locations, and the learned field can be queried at any output coordinates, accommodating irregular or moving sensors and adaptive meshes. Experiments on parametric diffusion equations and two-dimensional Kolmogorov flow demonstrate reconstruction across varying initial conditions, forcing terms, diffusion coefficients, Reynolds numbers, and sensor configurations.',
    'The symplectic gyroceptron is a structure-preserving neural architecture for approximating discrete flow maps of nearly periodic Hamiltonian systems. Its construction guarantees that the learned surrogate is both symplectic and nearly periodic, which gives rise to a formal discrete adiabatic invariant. These properties provide a mechanism for long-time stability while allowing the learned map to step over fast oscillatory timescales. Numerical examples on coupled oscillators and charged-particle dynamics illustrate the advantages over unconstrained surrogate maps.',
    'Rotations and rigid-body motions evolve on matrix Lie groups, so an unconstrained neural model can easily predict states that violate the underlying geometry. LieFVIN instead learns controlled Lagrangian or Hamiltonian dynamics through a forced variational integrator whose discrete updates preserve the Lie-group configuration and the symplectic structure of the dynamics by construction. It can learn from position and velocity data or from position-only observations, and it predicts the next state directly without repeatedly solving a neural ordinary differential equation. Pendulum and quadrotor experiments demonstrate accurate long-horizon prediction and use the learned model in discrete-time predictive control for stabilization and trajectory tracking.',
    'Variable time steps normally destroy the long-time structure-preserving behavior of symplectic integrators. This paper uses a Poincaré time transformation to represent an adaptive physical-time schedule as a fixed-step Hamiltonian system on an extended state space, then constructs the Type II and Type III Hamiltonian variational integrators needed for the resulting degenerate Hamiltonian. After establishing error results and testing the framework on the Kepler problem, it applies the same construction to accelerated optimization, viewed as the numerical simulation of time-dependent Bregman Hamiltonian dynamics. Time rescaling produces explicit variational and splitting algorithms that follow higher-order optimization trajectories through a more efficient lower-order system and require far fewer iterations than fixed-step integration on the reported objective.',
    'This paper extends the Bregman variational interpretation of accelerated optimization from vector spaces to Riemannian manifolds, allowing the continuous optimization dynamics to respect the geometry of the search space. It constructs intrinsic time-dependent Lagrangian and Hamiltonian systems on the manifold. Under the stated geometric assumptions, their trajectories achieve any prescribed polynomial rate of order 1/t^p for geodesically convex and weakly quasi-convex objectives, together with an exponential rate for strongly geodesically convex objectives. The paper also proves that the Riemannian systems are closed under time rescaling, providing the foundation for later adaptive and structure-preserving discretizations.',
    'This two-page proceedings contribution gives a concise overview of the variational interpretation of accelerated optimization. It recalls how time-dependent Bregman Lagrangian and Hamiltonian flows can produce arbitrary polynomial convergence rates in continuous time. Its central point is that the same construction can be extended from vector spaces to optimization on Riemannian manifolds.',
    'This paper first develops discrete variational integrators with holonomic constraints, which describe an embedded manifold through a system of equations. It gives both Lagrangian and Hamiltonian formulations and establishes the accuracy of the resulting implicit schemes. Applied to eigenvalue and Procrustes optimization on spheres and Stiefel manifolds, the time-rescaled Hamiltonian method requires fewer iterations than fixed-time integration, the tested Euler-Lagrange discretizations, and Riemannian gradient descent. The tradeoff is that the constraint equations must be solved at every step, increasing the cost of each iteration and making the method harder to tune.',
    'This paper avoids the nonlinear constraint solve of discrete constrained variational integrators by taking an explicit Hamiltonian variational step in the surrounding Euclidean space and projecting the new position back onto the manifold. The resulting algorithms are simple when the manifold projection is available in closed form. On eigenvalue and Procrustes problems over spheres and Stiefel manifolds, the time-rescaled method requires fewer iterations than its fixed-time version, the tested Euler-Lagrange discretizations, and Riemannian gradient descent. It is also easier to tune and runs three to four orders of magnitude faster than the implicit constrained method in the reported comparisons.',
    'This paper develops time-adaptive Lagrangian variational integrators that are defined directly on manifolds and Lie groups, without relying on coordinates from a surrounding Euclidean space. By treating physical time as an additional dynamical variable, it derives a variational counterpart of the Poincaré time transformation and preserves symplectic structure under a prescribed time rescaling. Applied to the Bregman dynamics underlying accelerated optimization, the resulting vector-space algorithms match the efficiency of their adaptive Hamiltonian counterparts. The Lie-group extension yields an explicit optimizer for Wahba’s rotation-estimation problem on SO(3) that preserves the rotation constraints and is substantially cheaper per step than an implicit adaptive method.',
    'Symplectic accelerated optimizers simulate time-dependent Bregman dynamics, but their practical performance can depend strongly on oscillations, numerical precision, and several tuning choices. This paper shows that momentum restarting suppresses overshoot, improves robustness, and makes time adaptation largely unnecessary, while temporal looping prevents roundoff-driven instability without reducing efficiency. A broad comparison of geometric integrators and parameters leads to simpler algorithms with fewer quantities to tune. Tests on numerical and machine-learning objectives, including image classification and dynamics learning, show competitive performance with Adam on the reported tasks.',
    'This workshop paper introduces generalized local coordinates for momentum-based optimization on Gaussian Fisher-Rao manifolds. By exploiting sparsity and locally simplifying the metric, the coordinates provide efficient approximations to exponential and parallel-transport maps. The resulting method extends structured natural-gradient descent with stable momentum updates designed for large optimization and deep-learning problems.',
    'This work introduces generalized Riemannian normal coordinates for optimization over structured symmetric positive-definite matrices with the affine-invariant metric. The coordinates dynamically orthonormalize the metric and locally turn the constrained manifold problem into an unconstrained Euclidean one. This avoids the difficult differential equations normally required to keep momentum-based iterates on the submanifold. The resulting matrix-inverse-free second-order optimizers use only matrix multiplications and remain effective in low-precision deep-learning settings.',
    'The Mackey-Glass equation is a scalar delay differential equation and a canonical model of delayed-feedback chaos. Direct time simulation reveals stable long-term behavior, while numerical continuation also follows unstable periodic solutions and their bifurcations, allowing the two methods together to map moderate-delay regimes near the onset of chaos. A cusp and associated folds of periodic orbits partition parameter space, producing bistability between periodic solutions and later between a periodic orbit and a chaotic attractor that can disappear through either a boundary or an interior crisis. A separate route through subcritical period doubling, together with torus and fold-flip bifurcations and Lyapunov-exponent calculations, completes the description of the chaotic regions.'
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
