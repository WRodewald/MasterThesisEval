function [tbl, meta] = load_mushra_data(file_name)

    % 0. import
    opts = detectImportOptions(file_name);
    opts.DataLines = [2 inf];
    opts = setvartype(opts, 'char');
    raw = table2cell(readtable(file_name, opts));

    % remove blacklisted entries
    raw(3401:(3401+170-1),:) = [];
    
    % 1. remove example entires
    [row_examples, ~] = find(~cellfun(@isempty,strfind(lower(raw(:,6)), lower("example"))));
    raw(row_examples, :) = [];

    %2. extract gender
    gender = raw(:,6);
    gender = regexprep(gender, 'f.+', 'female');
    gender = regexprep(gender, 'm.+', 'male');

    %3. extract vowel
    vowel = raw(:,6);
    vowel = regexprep(vowel, '.+a', 'a');
    vowel = regexprep(vowel, '.+i', 'i');
    vowel = regexprep(vowel, '.+o', 'o');

    %4. extract condition
    condition = raw(:,7);
    condition = strrep(condition,'C1', 'harmonic');
    condition = strrep(condition,'C2', 'estimated');
    condition = strrep(condition,'C3', 'synthesized');
    condition = strrep(condition,'C4', 'anchor');
   
    %5. extract rating
    rating = cellfun(@str2num, raw(:,8));

    %6. generate id (for debugging)
    id = transpose(1 + floor((0:(length(rating)-1))/150));

    %7. creat table
    tbl = table(id, gender, vowel, condition, rating, 'VariableNames',{'ID', 'Gender','Vowel','Condition', 'Rating'});
    tbl.Gender    = categorical(tbl.Gender);
    tbl.Vowel     = categorical(tbl.Vowel);
    tbl.Condition = categorical(tbl.Condition);
    
    
    
    % meta data
    meta.age    = categorical(raw(1:150:end, 3));
    meta.gender = categorical(raw(1:150:end, 4));
    meta.matr = categorical(raw(1:150:end, 5));
    
    if (any(contains(categories(meta.gender), 'none')))
        meta.gender = renamecats(meta.gender, 'none', 'did not answer');
    end
    
    meta.times = cellfun(@str2num, raw(1:5:end,9));
end

