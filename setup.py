from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="toolsfromai",
    version="0.1.0",
    author="AI Tools Generator",
    description="A collection of AI-generated tools for various tasks",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/otw128/toolsfromai",
    packages=find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.7",
    install_requires=[],
)
