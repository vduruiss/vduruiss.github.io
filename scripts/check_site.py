#!/usr/bin/env python3
"""Dependency-free checks for the static website."""

from html.parser import HTMLParser
from pathlib import Path
import ast
import re
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
HTML_FILES = sorted(ROOT.glob("*.html"))

EXPECTED_PUBLICATION_TITLES_IN_ORDER = [
    "Symplectic Numerical Integration at the service of Accelerated Optimization and Structure-Preserving Dynamics Learning",
    "Stable Singularity of the Euler Equations on R<sup>3</sup>",
    "Stability Framework for the Singularity of the Euler Equations on R<sup>3</sup>",
    "Equation Recast for Canonical Operator Learning Across Parametric PDEs",
    "Inverse Design of Quantum Control Sequences with Fourier Neural Operators",
    "Fourier Neural Operators Explained: A Practical Perspective",
    "Principled Approaches for Extending Neural Architectures to Function Spaces for Operator Learning",
    "A Library for Learning Neural Operators",
    "NOBLE - Neural Operator with Biologically-informed Latent Embeddings to Capture Experimental Variability in Biological Neuron Models",
    "Enabling Automatic Differentiation with Mollified Graph Neural Operators",
    "FC-PINO: High Precision Physics-Informed Neural Operators via Fourier Continuation",
    "Fourier Neural Operators for Fast Simulation and Inverse Design of Second-Harmonic Generation in TFLN Waveguide",
    "Inverse Design with Fourier Neural Operators for Quantum System Control",
    "Boundary-Augmented Neural Operators for Better Generalization to Unseen Geometries",
    "Coarse-to-Fine 3D MRI Reconstruction via 3D Neural Operators",
    "FG-ConvNO: A Geometry-Aware Neural Operator for Propeller CFD Prediction",
    "Towards Enforcing Hard Physics Constraints in Operator Learning Frameworks",
    "Projected Neural Differential Equations for Learning Constrained Dynamics",
    "An Operator Learning Framework for Spatiotemporal Super-resolution of Scientific Simulations",
    "Approximation of Nearly-Periodic Symplectic Maps via Structure-Preserving Neural Networks",
    "Lie Group Forced Variational Integrator Networks for Learning and Control of Robot Systems",
    "Adaptive Hamiltonian Variational Integrators and Applications to Symplectic Accelerated Optimization",
    "A Variational Formulation of Accelerated Optimization on Riemannian Manifolds",
    "Variational Accelerated Optimization on Riemannian Manifolds",
    "Accelerated Optimization on Riemannian Manifolds via Discrete Constrained Variational Integrators",
    "Accelerated Optimization on Riemannian Manifolds via Projected Variational Integrators",
    "Time-adaptive Lagrangian Variational Integrators for Accelerated Optimization",
    "Practical Perspectives on Symplectic Accelerated Optimization",
    "Practical Structured Riemannian Optimization with Momentum by using Generalized Normal Coordinates",
    "Simplifying Momentum-based Positive-definite Submanifold Optimization with Applications to Deep Learning",
    "Bistability, Bifurcations and Chaos in the Mackey–Glass Equation",
]


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()
        self.images_without_alt = []

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if "id" in values:
            self.ids.add(values["id"])
        if tag == "a" and values.get("href"):
            self.links.append(values["href"])
        if tag == "img" and "alt" not in values:
            self.images_without_alt.append(values.get("src", "<unknown>"))


def main():
    failures = []
    publication_count = 0

    for html_file in HTML_FILES:
        source = html_file.read_text(encoding="utf-8")
        parser = SiteParser()
        parser.feed(source)
        publication_count += source.count('<article class="publication')

        for image in parser.images_without_alt:
            failures.append(f"{html_file.name}: image missing alt text: {image}")

        for href in parser.links:
            parsed = urlparse(href)
            if parsed.scheme in {"http", "https", "mailto", "tel"}:
                continue
            path_part, _, fragment = href.partition("#")
            target_file = ROOT / (path_part or html_file.name)
            if not target_file.exists():
                failures.append(f"{html_file.name}: broken local link: {href}")
                continue
            if fragment and target_file.suffix == ".html":
                target_parser = SiteParser()
                target_parser.feed(target_file.read_text(encoding="utf-8"))
                if fragment not in target_parser.ids:
                    failures.append(f"{html_file.name}: missing anchor target: {href}")

    for required in [
        "styles.css",
        "script.js",
        "assets/valentin-duruisseaux-old-site.jpg",
        "assets/logos/nvidia.svg",
        "sitemap.xml",
        ".nojekyll",
    ]:
        if not (ROOT / required).exists():
            failures.append(f"Missing required file: {required}")

    if publication_count != 31:
        failures.append(f"Expected 31 research records, found {publication_count}")

    publications_source = (ROOT / "publications.html").read_text(encoding="utf-8")
    publication_titles = re.findall(r"<h3>(.*?)</h3>", publications_source)
    if publication_titles != EXPECTED_PUBLICATION_TITLES_IN_ORDER:
        failures.append("Publication order no longer matches the summary order in script.js")

    script_source = (ROOT / "script.js").read_text(encoding="utf-8")
    summary_block = script_source.split("const abstractSummaries = [", 1)[1].split("\n  ];", 1)[0]
    summaries = []
    companion_parts = {}
    for line in summary_block.splitlines():
        stripped = line.strip()
        if stripped.startswith(("before:", "title:", "after:")):
            key, value = stripped.split(":", 1)
            companion_parts[key] = ast.literal_eval(value.strip().rstrip(","))
        elif line.startswith("    '"):
            summaries.append(ast.literal_eval(stripped.rstrip(",")))
    if companion_parts:
        summaries.insert(2, companion_parts["before"] + companion_parts["title"] + companion_parts["after"])

    if len(summaries) != publication_count:
        failures.append(f"Expected {publication_count} publication summaries, found {len(summaries)}")
    for index, summary in enumerate(summaries, start=1):
        sentence_count = len(re.findall(r"[.!?](?=\s+[A-Z]|$)", summary))
        if sentence_count not in {3, 4}:
            failures.append(f"Publication summary {index} has {sentence_count} sentences, expected 3 or 4")

    if failures:
        print("Site checks failed:")
        for failure in failures:
            print(f"  - {failure}")
        raise SystemExit(1)

    print(f"Site checks passed: {len(HTML_FILES)} HTML files, {publication_count} publication records.")


if __name__ == "__main__":
    main()
