
library(glmmTMB)

mushra_data = read.csv(file=file.path("data", "mushra_formatted.csv"))

mushra_data$R2 = 0.99 * (1-mushra_data$Rating / 100);


model = glmmTMB(R2 ~ Condition + Gender + Vowel + Gender*Vowel + Gender*Condition + Vowel*Condition + Gender*Vowel*Condition + (1|ID), mushra_data, ziformula = ~., family=beta_family(link = "logit"))


summary(model)
