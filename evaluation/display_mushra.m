clear all; 
close all;

% load / format table
tbl = load_mushra_data('data/mushra.csv');
writetable(tbl, 'data/mushra_formatted.csv');


%%
subplot(2,2,1)
boxplot(tbl.Rating(tbl.Condition=="synthesized"), tbl.Gender(tbl.Condition=="synthesized"));

subplot(2,2,2)
boxplot(tbl.Rating(tbl.Condition=="synthesized"), tbl.Vowel(tbl.Condition=="synthesized"));


subplot(2,1,2)
boxplot(tbl.Rating, tbl.Condition);

%mdl = fitlm(tbl,  'Rating~Gender,Vowel,Condition,Rating')
%anova(mdl)


% fri

 data_friedman = [ tbl.Rating(tbl.Condition == "reference"), ...
                   tbl.Rating(tbl.Condition == "harmonic"), ...
                   tbl.Rating(tbl.Condition == "estimated"), ...
                   tbl.Rating(tbl.Condition == "synthesized"), ...
                   tbl.Rating(tbl.Condition == "anchor")];
      
      
[p_fri,f_table, stats] = friedman(data_friedman);


[c,m,~,nms] = multcompare(stats, 'CType', 'bonferroni');


%% ANOVA



%model = table(tbl.Rating(,'VariableNames',{'Rating'});

lme_3var = fitlme(tbl,'Rating~Condition + (Gender) + (Vowel)', 'DummyVarCoding', 'effects');
p_lme = anova(lme_3var);

%% N-way anova

[p, ~, stats_2] = anovan(tbl.Rating(tbl.Condition == "synthesized"), {tbl.Vowel(tbl.Condition == "synthesized"), tbl.Gender(tbl.Condition == "synthesized")});

%% 2-way anova

data_anova2 =  [tbl.Rating(tbl.Condition == "synthesized" & tbl.Gender == "male"   & tbl.Vowel == "a"), ...
                tbl.Rating(tbl.Condition == "synthesized" & tbl.Gender == "female" & tbl.Vowel == "a"); ...
                tbl.Rating(tbl.Condition == "synthesized" & tbl.Gender == "male"   & tbl.Vowel == "i"), ...
                tbl.Rating(tbl.Condition == "synthesized" & tbl.Gender == "female" & tbl.Vowel == "i"); ...
                tbl.Rating(tbl.Condition == "synthesized" & tbl.Gender == "male"   & tbl.Vowel == "o"), ...
                tbl.Rating(tbl.Condition == "synthesized" & tbl.Gender == "female" & tbl.Vowel == "o")];
reps_anova2 = size(data_anova2,1) / 3;
[p_anova2, ~, stats_anova2] = anova2(data_anova2, reps_anova2);


%% 

figure
subplot(5,2,1)
hist(tbl.Rating(tbl.Condition == 'reference' & tbl.Gender == 'male'), 100)
xlim([0,100])

subplot(5,2,2)
hist(tbl.Rating(tbl.Condition == 'reference' & tbl.Gender == 'female'), 100)
xlim([0,100])

subplot(5,2,3)
hist(tbl.Rating(tbl.Condition == 'harmonic' & tbl.Gender == 'male'), 100)
xlim([0,100])

subplot(5,2,4)
hist(tbl.Rating(tbl.Condition == 'harmonic' & tbl.Gender == 'female'), 100)
xlim([0,100])

subplot(5,2,5)
hist(tbl.Rating(tbl.Condition == 'estimated' & tbl.Gender == 'male'), 10)
xlim([0,100])

subplot(5,2,6)
hist(tbl.Rating(tbl.Condition == 'estimated' & tbl.Gender == 'female'), 10)
xlim([0,100])

subplot(5,2,7)
hist(tbl.Rating(tbl.Condition == 'synthesized' & tbl.Gender == 'male'), 10)
xlim([0,100])

subplot(5,2,8)
hist(tbl.Rating(tbl.Condition == 'synthesized' & tbl.Gender == 'female'), 10)
xlim([0,100])

subplot(5,2,9)
hist(tbl.Rating(tbl.Condition == 'anchor' & tbl.Gender == 'male'), 10)
xlim([0,100])

subplot(5,2,10)
hist(tbl.Rating(tbl.Condition == 'anchor' & tbl.Gender == 'female'), 10)
xlim([0,100])


%%

figure
subplot(5,2,1)
hist(tbl.Rating(tbl.Condition == 'reference' & tbl.Gender == 'male'), 100)
xlim([0,100])

subplot(5,2,2)
hist(tbl.Rating(tbl.Condition == 'reference' & tbl.Gender == 'female'), 100)
xlim([0,100])

subplot(5,2,3)
hist(tbl.Rating(tbl.Condition == 'harmonic' & tbl.Gender == 'male')-tbl.Rating(tbl.Condition == 'reference' & tbl.Gender == 'male'), 20)


subplot(5,2,4)
hist(tbl.Rating(tbl.Condition == 'harmonic' & tbl.Gender == 'female')-tbl.Rating(tbl.Condition == 'reference' & tbl.Gender == 'female'), 20)


subplot(5,2,5)
hist(tbl.Rating(tbl.Condition == 'estimated' & tbl.Gender == 'male')-tbl.Rating(tbl.Condition == 'reference' & tbl.Gender == 'male'), 20)


subplot(5,2,6)
hist(tbl.Rating(tbl.Condition == 'estimated' & tbl.Gender == 'female')-tbl.Rating(tbl.Condition == 'reference' & tbl.Gender == 'female'), 20)


subplot(5,2,7)
hist(tbl.Rating(tbl.Condition == 'synthesized' & tbl.Gender == 'male')-tbl.Rating(tbl.Condition == 'reference' & tbl.Gender == 'male'), 20)


subplot(5,2,8)
hist(tbl.Rating(tbl.Condition == 'synthesized' & tbl.Gender == 'female')-tbl.Rating(tbl.Condition == 'reference' & tbl.Gender == 'female'), 20)

subplot(5,2,9)
hist(tbl.Rating(tbl.Condition == 'anchor' & tbl.Gender == 'male')-tbl.Rating(tbl.Condition == 'reference' & tbl.Gender == 'male'), 20)

subplot(5,2,10)
hist(tbl.Rating(tbl.Condition == 'anchor' & tbl.Gender == 'female')- tbl.Rating(tbl.Condition == 'reference' & tbl.Gender == 'female'), 20)




