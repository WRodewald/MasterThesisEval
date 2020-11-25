clear all; 
close all;

% load / format table
tbl = load_quality_data('data/quality_ab.csv');

% write out
roughness   = tbl(tbl.Quality == "Roughness",:);
naturalness = tbl(tbl.Quality == "Naturalness",:);
breathiness = tbl(tbl.Quality == "Breathiness",:);
brightness  = tbl(tbl.Quality == "Brightness",:);

writetable(roughness,   'data/quality_roughness.csv');
writetable(naturalness, 'data/quality_naturalness.csv');
writetable(breathiness, 'data/quality_breathiness.csv');
writetable(brightness,  'data/quality_brightness.csv');

table_full = table(roughness.ID, roughness.Vowel, roughness.Gender, roughness.Rating, breathiness.Rating, brightness.Rating, naturalness.Rating, ...
                   'VariableNames', {'ID', 'Vowel', 'Gender', 'Roughness', 'Breathiness', 'Brightness', 'Naturalness'});

writetable(table_full,  'data/quality_formatted.csv');

%%

group   = tbl.Vowel;
binRange = -4:4;
subplot(2,2,1);
hist_a = histcounts(tbl.Rating(tbl.Quality == "Breathiness" & group == "a"),[binRange Inf]);
hist_i = histcounts(tbl.Rating(tbl.Quality == "Breathiness" & group == "i"),[binRange Inf]);
hist_o = histcounts(tbl.Rating(tbl.Quality == "Breathiness" & group == "o"),[binRange Inf]);
bar(binRange,[hist_a; hist_o; hist_i]')
title("Vowel - Breathiness");
ylim([0,50]);

subplot(2,2,2);
hist_a = histcounts(tbl.Rating(tbl.Quality == "Brightness" & group == "a"),[binRange Inf]);
hist_i = histcounts(tbl.Rating(tbl.Quality == "Brightness" & group == "i"),[binRange Inf]);
hist_o = histcounts(tbl.Rating(tbl.Quality == "Brightness" & group == "o"),[binRange Inf]);
bar(binRange,[hist_a; hist_o; hist_i]')
title("Vowel - Brightness");
ylim([0,50]);

subplot(2,2,3);
hist_a = histcounts(tbl.Rating(tbl.Quality == "Roughness" & group == "a"),[binRange Inf]);
hist_i = histcounts(tbl.Rating(tbl.Quality == "Roughness" & group == "i"),[binRange Inf]);
hist_o = histcounts(tbl.Rating(tbl.Quality == "Roughness" & group == "o"),[binRange Inf]);
bar(binRange,[hist_a; hist_o; hist_i]')
title("Vowel - Roughness");
ylim([0,50]);

subplot(2,2,4);
hist_a = histcounts(tbl.Rating(tbl.Quality == "Naturalness" & group == "a"),[binRange Inf]);
hist_i = histcounts(tbl.Rating(tbl.Quality == "Naturalness" & group == "i"),[binRange Inf]);
hist_o = histcounts(tbl.Rating(tbl.Quality == "Naturalness" & group == "o"),[binRange Inf]);
bar(binRange,[hist_a; hist_o; hist_i]')
title("Vowel - Naturalness");
ylim([0,50]);

figure
group   = tbl.Vowel;
binRange = -4:4;

subplot(2,2,1);
plot_mean_var(tbl.Rating(tbl.Quality == "Breathiness" & group == "a"))
hold on
plot_mean_var(tbl.Rating(tbl.Quality == "Breathiness" & group == "i"))
plot_mean_var(tbl.Rating(tbl.Quality == "Breathiness" & group == "o"))
hold off
title("Vowel - Breathiness");
xlim([-4, +4])

subplot(2,2,2);
plot_mean_var(tbl.Rating(tbl.Quality == "Brightness" & group == "a"))
hold on
plot_mean_var(tbl.Rating(tbl.Quality == "Brightness" & group == "i"))
plot_mean_var(tbl.Rating(tbl.Quality == "Breathiness" & group == "o"))
hold off
title("Vowel - Brightness");
xlim([-4, +4])

subplot(2,2,3);
plot_mean_var(tbl.Rating(tbl.Quality == "Roughness" & group == "a"))
hold on
plot_mean_var(tbl.Rating(tbl.Quality == "Roughness" & group == "i"))
plot_mean_var(tbl.Rating(tbl.Quality == "Breathiness" & group == "o"))
hold off
title("Vowel - Roughness");
xlim([-4, +4])

subplot(2,2,4);
plot_mean_var(tbl.Rating(tbl.Quality == "Naturalness" & group == "a"))
hold on
plot_mean_var(tbl.Rating(tbl.Quality == "Naturalness" & group == "i"))
plot_mean_var(tbl.Rating(tbl.Quality == "Breathiness" & group == "o"))
hold off
title("Vowel - Naturalness");
xlim([-4, +4])


%%
figure

group   = tbl.Gender;
binRange = -4:4;
subplot(2,2,1);
hist_m = histcounts(tbl.Rating(tbl.Quality == "Breathiness" & group == "male"),[binRange Inf]);
hist_f = histcounts(tbl.Rating(tbl.Quality == "Breathiness" & group == "female"),[binRange Inf]);
bar(binRange,[hist_m; hist_f]')
title("Vowel - Breathiness");
ylim([0,70]);

subplot(2,2,2);
hist_m = histcounts(tbl.Rating(tbl.Quality == "Brightness" & group == "male"),[binRange Inf]);
hist_f = histcounts(tbl.Rating(tbl.Quality == "Brightness" & group == "female"),[binRange Inf]);
bar(binRange,[hist_m; hist_f]')
title("Vowel - Brightness");
ylim([0,70]);

subplot(2,2,3);
hist_m = histcounts(tbl.Rating(tbl.Quality == "Roughness" & group == "male"),[binRange Inf]);
hist_f = histcounts(tbl.Rating(tbl.Quality == "Roughness" & group == "female"),[binRange Inf]);
bar(binRange,[hist_m; hist_f]')
title("Vowel - Roughness");
ylim([0,70]);

subplot(2,2,4);
hist_m = histcounts(tbl.Rating(tbl.Quality == "Naturalness" & group == "male"),[binRange Inf]);
hist_f = histcounts(tbl.Rating(tbl.Quality == "Naturalness" & group == "female"),[binRange Inf]);
bar(binRange,[hist_m; hist_f]')
title("Vowel - Naturalness");
ylim([0,70]);


figure

group   = tbl.Gender;
binRange = -4:4;

subplot(2,2,1);
plot_mean_var(tbl.Rating(tbl.Quality == "Breathiness" & group == "male"))
hold on
plot_mean_var(tbl.Rating(tbl.Quality == "Breathiness" & group == "female"))
hold off
title("Gender - Breathiness");
xlim([-4, +4])

subplot(2,2,2);
plot_mean_var(tbl.Rating(tbl.Quality == "Brightness" & group == "male"))
hold on
plot_mean_var(tbl.Rating(tbl.Quality == "Brightness" & group == "female"))
hold off
title("Gender - Brightness");
xlim([-4, +4])

subplot(2,2,3);
plot_mean_var(tbl.Rating(tbl.Quality == "Roughness" & group == "male"))
hold on
plot_mean_var(tbl.Rating(tbl.Quality == "Roughness" & group == "female"))
hold off
title("Gender - Roughness");
xlim([-4, +4])

subplot(2,2,4);
plot_mean_var(tbl.Rating(tbl.Quality == "Naturalness" & group == "male"))
hold on
plot_mean_var(tbl.Rating(tbl.Quality == "Naturalness" & group == "female"))
hold off
title("Gender - Naturalness");
xlim([-4, +4])

figure

%%
figure

group   = tbl.Gender;
binRange = -4:4;
subplot(2,2,1);
hist = histcounts(breathiness.Rating,[binRange Inf]);
bar(binRange,hist')
title("Breathiness");
ylim([0,200]);

subplot(2,2,2);
hist = histcounts(brightness.Rating,[binRange Inf]);
bar(binRange,hist')
title("Brightness");
ylim([0,200]);

subplot(2,2,3);
hist = histcounts(roughness.Rating,[binRange Inf]);
bar(binRange,hist')
title("Roughness");
ylim([0,200]);

subplot(2,2,4);
hist = histcounts(naturalness.Rating,[binRange Inf]);
bar(binRange,hist')
title("Naturalness");
ylim([0,200]);


%% evlauation

roughness   = tbl(tbl.Quality == "Roughness",:);
naturalness = tbl(tbl.Quality == "Naturalness",:);
breathiness = tbl(tbl.Quality == "Breathiness",:);
brightness  = tbl(tbl.Quality == "Brightness",:);

disp("###########################################################")
disp("roughness");
lme = fitlme(roughness,'Rating~ Gender + Vowel + (1|ID)');
anova(lme)
[p, ~, stats] = anovan(roughness.Rating, {roughness.Vowel, roughness.Gender})

disp("###########################################################")
disp("naturalness");
lme = fitlme(naturalness,'Rating~ Gender + Vowel + (1|ID)');
anova(lme)
[p, ~, stats] = anovan(naturalness.Rating, {naturalness.Vowel, naturalness.Gender})

disp("###########################################################")
disp("breathiness");
lme = fitlme(breathiness,'Rating~ Gender + Vowel + (1|ID)');
anova(lme)
[p, ~, stats] = anovan(breathiness.Rating, {breathiness.Vowel, breathiness.Gender})

disp("###########################################################")
disp("Brightness");
lme = fitlme(brightness,'Rating~ Gender + Vowel + (1|ID)');
anova(lme)
[p, ~, stats] = anovan(brightness.Rating, {brightness.Vowel, brightness.Gender})


disp("###########################################################")
disp("Roughness");
[~,p] = ttest(tbl.Rating(tbl.Quality == "Roughness"))
disp("Naturalness");
[~,p] = ttest(tbl.Rating(tbl.Quality == "Naturalness"))
disp("Breathiness");
[~,p] = ttest(tbl.Rating(tbl.Quality == "Breathiness"))
disp("Brightness");
[~,p] = ttest(tbl.Rating(tbl.Quality == "Brightness"))



function [] = plot_mean_var(hist_data, c_idx)
    
m  = mean(hist_data);
v  = var(hist_data);
v1 = m - v;
v2 = m + v;

plot( [v1, v1, v1, m, m, m, m, v2, v2, v2], [-1, +1, 0, 0, 2, -2, 0,  0, +1, -1]);

end

