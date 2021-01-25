clear all; close all;

% script formats data from raw resources and stores them in .csv files

[tbl_quality,~] = load_quality_data('data/quality_ab.csv');
[tbl_mushra, ~] = load_mushra_data('data/mushra.csv');

% mushra
writetable(tbl_mushra, 'data/mushra_formatted.csv');

% quality
roughness   = tbl_quality(tbl_quality.Quality == "Roughness",:);
naturalness = tbl_quality(tbl_quality.Quality == "Naturalness",:);
breathiness = tbl_quality(tbl_quality.Quality == "Breathiness",:);
brightness  = tbl_quality(tbl_quality.Quality == "Brightness",:);

tbl_quality_full = table(roughness.ID, roughness.SID, roughness.Vowel, roughness.Gender, roughness.Rating, breathiness.Rating, brightness.Rating, naturalness.Rating, ...
                   'VariableNames', {'ID', 'SID', 'Vowel', 'Gender', 'Roughness', 'Breathiness', 'Brightness', 'Naturalness'});

writetable(tbl_quality_full,  'data/quality_formatted.csv');


%%
CR = tbl_mushra(tbl_mushra.Condition == "reference",:);
CH = tbl_mushra(tbl_mushra.Condition == "harmonic",:);
CE = tbl_mushra(tbl_mushra.Condition == "estimated",:);
CP = tbl_mushra(tbl_mushra.Condition == "synthesized",:);
CA = tbl_mushra(tbl_mushra.Condition == "anchor",:);

CH.Rating = CH.Rating - CR.Rating;
CE.Rating = CE.Rating - CR.Rating;
CP.Rating = CP.Rating - CR.Rating;
CA.Rating = CA.Rating - CR.Rating;

mushra_delta = [CH; CE; CP; CA];
writetable(mushra_delta, 'data/mushra_delta.csv');

%%
CR = tbl_mushra(tbl_mushra.Condition == "reference",:);
CH = tbl_mushra(tbl_mushra.Condition == "harmonic",:);
CE = tbl_mushra(tbl_mushra.Condition == "estimated",:);
CP = tbl_mushra(tbl_mushra.Condition == "synthesized",:);
CA = tbl_mushra(tbl_mushra.Condition == "anchor",:);

CA.Rating = CA.Rating - CP.Rating;
CP.Rating = CP.Rating - CE.Rating;
CE.Rating = CE.Rating - CH.Rating;
CH.Rating = CH.Rating - CR.Rating;

mushra_delta = [CH; CE; CP; CA];
writetable(mushra_delta, 'data/mushra_delta2.csv');

figure
subplot(4,1,1);
hist(CH.Rating-CR.Rating,40)
subplot(4,1,2);
hist(CE.Rating-CH.Rating,40)
subplot(4,1,3);
hist(CP.Rating-CE.Rating,40)
subplot(4,1,4);
hist(CA.Rating-CP.Rating,40)
