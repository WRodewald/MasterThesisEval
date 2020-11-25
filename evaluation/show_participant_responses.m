clear all; 
close all;

[quality,meta_quality] = load_quality_data('data/quality_ab.csv');
[mushra,meta_mushra]  = load_mushra_data('data/mushra.csv');


select = "mushra";


if(select == "mushra")
    ids = unique(mushra.ID);
    for i = 1:size(ids)
        filtered = mushra(ids(i) == mushra.ID,:);
       
        boxplot(filtered.Rating, filtered.Condition);
        title(['ID = ' num2str(ids(i))]);
        
        pause
    end    
end


if (select == "quality")
    ids = unique(quality.ID);
    for i = 1:size(ids)
        filtered = quality(ids(i) == quality.ID,:);        
        
        roughness   = filtered(filtered.Quality == "Roughness",:);
        naturalness = filtered(filtered.Quality == "Naturalness",:);
        breathiness = filtered(filtered.Quality == "Breathiness",:);
        brightness  = filtered(filtered.Quality == "Brightness",:);
      
     
        binRange = -4:4;
        subplot(2,2,1);
        hist = histcounts(breathiness.Rating,[binRange Inf]);
        bar(binRange,hist')
        %title("Breathiness");
        title("A");
        ylim([0,30]);

        subplot(2,2,2);
        hist = histcounts(brightness.Rating,[binRange Inf]);
        bar(binRange,hist')
        %title("Brightness");
        title("B");
        ylim([0,30]);

        subplot(2,2,3);
        hist = histcounts(roughness.Rating,[binRange Inf]);
        bar(binRange,hist')
        %title("Roughness");
        title("C");
        ylim([0,30]);

        subplot(2,2,4);
        hist = histcounts(naturalness.Rating,[binRange Inf]);
        bar(binRange,hist')
        %title("Naturalness");
        title("D");
        ylim([0,30]);
        
        pause
    end   
end