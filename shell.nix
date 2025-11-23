{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    python313
    python313Packages.pandas
    python313Packages.matplotlib
    python313Packages.scikit-learn
    python313Packages.seaborn
  ];

  shellHook = ''
    echo "Python data science environment ready!"
  '';
}