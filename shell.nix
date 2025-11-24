{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    python313
    # Data science packages
    python313Packages.pandas
    python313Packages.matplotlib
    python313Packages.scikit-learn
    python313Packages.seaborn
    python313Packages.numpy
    # Flask for web development
    python313Packages.flask
    python313Packages.flask-cors
  ];

  shellHook = ''
    echo "Python data science environment ready!"
  '';
}