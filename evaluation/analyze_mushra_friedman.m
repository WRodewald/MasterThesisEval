clear all; 
close all;

% script to analyse 1st experiment using Friedman / Wilcoxon

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


% fri

 data_friedman = [ tbl.Rating(tbl.Condition == "reference"), ...
                   tbl.Rating(tbl.Condition == "harmonic"), ...
                   tbl.Rating(tbl.Condition == "estimated"), ...
                   tbl.Rating(tbl.Condition == "synthesized"), ...
                   tbl.Rating(tbl.Condition == "anchor")];
      
      
[p_fri,f_table, stats] = friedman(data_friedman);


[c,m,~,nms] = multcompare(stats, 'CType', 'bonferroni');

groups = {'reference', 'harmonic', 'estimated', 'synthesized', 'anchor'}; 

p_mat = ones(5,5);
groups_short = {'C_R', 'C_H', 'C_E', 'C_P', 'C_A'};

for i = 1:length(groups)
    for k = (i+1):length(groups)
        
        [p_mat(i,k),h,stats] = signrank(tbl.Rating(tbl.Condition == groups{i}), ...
                              tbl.Rating(tbl.Condition == groups{k}));
    
        res = ['$' groups_short{i} '$ - $' groups_short{k} '$ & '...
            num2str(stats.signedrank,2) ' & ' ...
            num2str(stats.zval,'%.2f') ' & ' ...
            num2str(p_mat(i,k),'%.2f') ' \\\\ '];
        
        fprintf(res);
        fprintf('\n');
    end 
end
    
n = 4+3+2+1;
p_thres = 0.05 / n;

sig_mat = p_mat < p_thres;
