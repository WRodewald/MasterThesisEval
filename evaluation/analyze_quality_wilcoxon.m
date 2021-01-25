clear all; 
close all;


% script to analyse 2nd experiment using Wilcoxon

% load / format table
tbl = load_quality_data('data/quality_ab.csv');


roughness   = tbl(tbl.Quality == "Roughness",:);
naturalness = tbl(tbl.Quality == "Naturalness",:);
breathiness = tbl(tbl.Quality == "Breathiness",:);
brightness  = tbl(tbl.Quality == "Brightness",:);

%% histograms

subplot(2,2,1)
histogram(naturalness.Rating)
title('Naturalness');

subplot(2,2,2)
histogram(brightness.Rating)
title('Brightness');

subplot(2,2,3)
histogram(breathiness.Rating)
title('Breathiness');

subplot(2,2,4)
histogram(roughness.Rating)
title('Roughness');


%%

[p,h,stats] = signrank(naturalness.Rating,0, 'tail', 'left');
fprintf("\n\nNautralness\n");
fprintf("mean = %.2f, median = %.2f, sd=%.2f\n", mean(naturalness.Rating), median(naturalness.Rating), std(naturalness.Rating));
disp(stats);
disp(['p= ' num2str(p)])

[p,h,stats] = signrank(brightness.Rating,0, 'tail', 'left');
fprintf("\n\nBrightness\n");
fprintf("mean = %.2f, median = %.2f, sd=%.2f\n", mean(brightness.Rating), median(brightness.Rating), std(brightness.Rating));
disp(stats);
disp(['p= ' num2str(p)])

[p,h,stats] = signrank(breathiness.Rating,0, 'tail', 'left');
fprintf("\n\nBreathiness\n");
fprintf("mean = %.2f, median = %.2f, sd=%.2f\n", mean(breathiness.Rating), median(breathiness.Rating), std(breathiness.Rating));
disp(stats);
disp(['p= ' num2str(p)])

[p,h,stats] = signrank(roughness.Rating,0, 'tail', 'left');
fprintf("\n\nRoughness\n");
fprintf("mean = %.2f, median = %.2f, sd=%.2f\n", mean(roughness.Rating), median(roughness.Rating), std(roughness.Rating));
disp(stats);
disp(['p = ' num2str(p)])
