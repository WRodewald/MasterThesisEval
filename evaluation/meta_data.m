clear all;
close all;


[~,meta_quality] = load_quality_data('data/quality_ab.csv');
[~,meta_mushra]  = load_mushra_data('data/mushra.csv');




figure
subplot(1,2,1)
barplot(meta_mushra.age)
title(['Age, N = ' num2str(length(meta_mushra.age))])
subplot(1,2,2)
barplot(meta_mushra.gender)
title(['Age, N = ' num2str(length(meta_mushra.gender))])


figure
subplot(1,2,1)
barplot(meta_quality.age)
title(['Age, N = ' num2str(length(meta_quality.age))])
subplot(1,2,2)
barplot(meta_quality.gender)
title(['Age, N = ' num2str(length(meta_quality.gender))])


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
hist(meta_mushra.times(meta_mushra.times < mushra_times90) / (60*1000),100);

figure
hist(meta_quality.times(meta_quality.times < quality_times90) / (60*1000),100);


function [] = barplot(data)

    [groups, counts] = groupcounts(data);
    bar(counts, groups);

end