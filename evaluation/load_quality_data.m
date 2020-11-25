function [tbl, meta] = load_quality_data(file_name)

    % 0. import
    opts = detectImportOptions(file_name);
    opts.DataLines = [2 inf];
    opts = setvartype(opts, 'char');
    raw = table2cell(readtable(file_name, opts));

    % 1. remove example entires
    [row_examples, ~] = find(~cellfun(@isempty,strfind(lower(raw(:,6)), lower("example"))));
    raw(row_examples, :) = [];

    %2. extract gender
    gender = raw(:,6);
    gender = regexprep(gender, 'quality_f.+', 'female');
    gender = regexprep(gender, 'quality_m.+', 'male');

    %3. extract vowel
    vowel = raw(:,6);
    vowel = regexprep(vowel, '.+a', 'a');
    vowel = regexprep(vowel, '.+i', 'i');
    vowel = regexprep(vowel, '.+o', 'o');

    %4. extract rating
    order = cellfun(@str2num, raw(:,9));
    rating = cellfun(@str2num, raw(:,8));
    rating = (order == 0) .* rating - (order == 1) .* rating;

    %5. quality
    quality = raw(:,7);
    
    %6. generate id (for debugging)
    id = transpose(1 + floor((0:(length(rating)-1))/120));

    %7. creat table
    tbl = table(id, gender, vowel, quality, rating, 'VariableNames',{'ID', 'Gender','Vowel', 'Quality', 'Rating'});
    tbl.Gender    = categorical(tbl.Gender);
    tbl.Vowel     = categorical(tbl.Vowel);
    tbl.Quality   = categorical(tbl.Quality);
    
    % meta data
    meta.age    = categorical(raw(1:120:end, 3));
    meta.gender = categorical(raw(1:120:end, 4));
    meta.matr = categorical(raw(1:120:end, 5));
    
    if (any(contains(categories(meta.gender), 'none')))
        meta.gender = renamecats(meta.gender, 'none', 'did not answer');
    end
    
    meta.times = cellfun(@str2num, raw(1:4:end,10));
end

