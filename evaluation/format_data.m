clear all; close all;


[tbl_quality,~] = load_quality_data('data/quality_ab.csv');
[tbl_mushra, ~] = load_mushra_data('data/mushra.csv');

% mushra
writetable(tbl_mushra, 'data/mushra_formatted.csv');

% quality
roughness   = tbl_quality(tbl_quality.Quality == "Roughness",:);
naturalness = tbl_quality(tbl_quality.Quality == "Naturalness",:);
breathiness = tbl_quality(tbl_quality.Quality == "Breathiness",:);
brightness  = tbl_quality(tbl_quality.Quality == "Brightness",:);

tbl_quality_full = table(roughness.ID, roughness.Vowel, roughness.Gender, roughness.Rating, breathiness.Rating, brightness.Rating, naturalness.Rating, ...
                   'VariableNames', {'ID', 'Vowel', 'Gender', 'Roughness', 'Breathiness', 'Brightness', 'Naturalness'});

writetable(tbl_quality_full,  'data/quality_formatted.csv');
