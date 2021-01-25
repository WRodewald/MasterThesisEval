clear all;
close all;

% This script extracts some meta data such as age, gender, TU Berlin
% matriculation number and so on


[~,meta_quality] = load_quality_data('data/quality_ab.csv');
[~,meta_mushra]  = load_mushra_data('data/mushra.csv');

mushra_age  = cellfun(@str2num, cellstr(meta_mushra.age));
quality_age = cellfun(@str2num, cellstr(meta_quality.age));
%%

disp("Experiment 1 Age");
fprintf("mean(Age) = %.2f, std(Age) = %.2f, min(Age) = %.2f, max(Age) = %.2f\n\n", mean(mushra_age), std(mushra_age), min(mushra_age),max(mushra_age));

disp("Experiment 2 Age");
fprintf("mean(Age) = %.2f, std(Age) = %.2f, min(Age) = %.2f, max(Age) = %.2f\n\n", mean(quality_age), std(quality_age), min(quality_age),max(quality_age));



figure
subplot(1,2,1)
barplot(meta_mushra.age)
title(['Exp. 1: Age, N = ' num2str(length(meta_mushra.age))])
subplot(1,2,2)
barplot(meta_mushra.gender)
title(['Exp. 1: Age, N = ' num2str(length(meta_mushra.gender))])
 


figure
subplot(1,2,1)
barplot(meta_quality.age)
title(['Exp. 2: Age, N = ' num2str(length(meta_quality.age))])
subplot(1,2,2)
barplot(meta_quality.gender)
title(['Exp. 2: Age, N = ' num2str(length(meta_quality.gender))])


one_experiment = setdiff(meta_mushra.matr, meta_quality.matr);
two_experiment = intersect(meta_mushra.matr, meta_quality.matr);
one_experiment = one_experiment(~isundefined(one_experiment));
two_experiment = two_experiment(~isundefined(two_experiment));

fprintf("One Experiment:\n");
disp(one_experiment);

fprintf("Two Experiment:\n");
disp(two_experiment);


mushra_times90  = prctile(meta_mushra.times,98);
quality_times90 = prctile(meta_quality.times,98);

figure
hist(30 * meta_mushra.times(meta_mushra.times < mushra_times90) / (60*1000),100);
title("Duration of Experiment 1");

figure
hist(30 * meta_quality.times(meta_quality.times < quality_times90) / (60*1000),100);
title("Duration of Experiment 2");


function [] = barplot(data)

    [groups, counts] = groupcounts(data);
    bar(counts, groups);

end