# MasterThesisEval
Code for web study and analysis for master thesis evaluation

Includes webMUSHRA implementation of the studies website and evaluation code in `website` subfolder.

# webMUSHRA
This version is somewhat modified to include custom experiment designs and there are some alterations to the user experience. The original repositority can be found here:
https://github.com/audiolabs/webMUSHRA


# Raw Results
Raw results can be found in `evaluation/data/mushra.csv` for Experiment 1 and `evaluation/data/quality_ab.csv` for Experiment 2. Formatted results can be found in `evaluation/data/mushra_formatted.csv` for for Experiment 1 and `evaluation/data/quality_formatted.csv` for Experiment 2. 

# Evaluation
- Experiment 1: Friedman with Mixed Model (Matlab): `evaluation/analyze_mushra_friedman.m`
- Experiment 1: Mixed Model (Jamovi / GAMLj): `evaluation/data/mushra_formatted_mixed_model.omv`
- Experiment 2: Wilcoxon Signed Rank (Matlab): `evaluation/analyze_quality_wilcoxon.m`

Results can be found in scripts. Mixed model results are exported to `data/output_mushra_formatted_mixed_model` and `data/mushra_formatted_mixed_model.pdf`.
