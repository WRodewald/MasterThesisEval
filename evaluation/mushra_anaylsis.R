
library(lme4)
library(nlme)
library(emmeans)
library(GLMMadaptive)

mushra_data = read.csv(file=file.path("data", "mushra_formatted.csv"))



fm <- mixed_model(fixed = (Rating/100) ~ Condition + Gender + Vowel, random = ~ 1 | ID, data = mushra_data, family = binomial(), control = list(verbose=TRUE))

